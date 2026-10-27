begin;
create table public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id),
  broker_id uuid references public.brokers(id),
  property_id uuid references public.properties(id),
  previous_status text not null,
  new_status text not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  check ((broker_id is null) <> (property_id is null))
);
alter table public.moderation_events enable row level security;
revoke all on public.moderation_events from anon, authenticated;
grant select, insert on public.moderation_events to authenticated;
create policy moderation_read on public.moderation_events for select to authenticated using (
  public.is_admin() or exists(select 1 from public.brokers b where b.id=broker_id and b.profile_id=auth.uid())
  or exists(select 1 from public.properties p join public.brokers b on b.id=p.broker_id where p.id=property_id and b.profile_id=auth.uid())
);
create policy moderation_insert on public.moderation_events for insert to authenticated with check (public.is_admin() and actor_id=auth.uid());
create index moderation_property_idx on public.moderation_events(property_id, created_at desc);
create index moderation_broker_idx on public.moderation_events(broker_id, created_at desc);

create function public.moderate_listing(entity text, target_id uuid, expected_status text, decision text, reason text)
returns void language plpgsql security invoker set search_path='' as $$
declare current_status text; broker_profile uuid;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
  if length(coalesce(reason,'')) > 2000 then raise exception 'Reason too long'; end if;
  if decision in ('rejected','changes_requested','suspended') and length(trim(coalesce(reason,'')))=0 then raise exception 'Reason required'; end if;
  if entity='broker' then
    if decision not in ('approved','rejected','suspended') then raise exception 'Invalid decision'; end if;
    select status::text, profile_id into current_status, broker_profile from public.brokers where id=target_id for update;
    if current_status is null or current_status<>expected_status or current_status=decision then raise exception 'Record changed; refresh before reviewing'; end if;
    -- Do not downgrade an administrator who also has a broker registration.
    if decision='approved' then update public.profiles set role='broker' where id=broker_profile and role<>'admin'; end if;
    update public.brokers set status=decision::public.broker_status where id=target_id;
    insert into public.moderation_events(actor_id,broker_id,previous_status,new_status,reason)
    values(auth.uid(),target_id,current_status,decision,coalesce(reason,''));
  elsif entity='property' then
    if decision not in ('approved','changes_requested','rejected','archived') then raise exception 'Invalid decision'; end if;
    -- Lock the broker first, matching the save function, so suspension cannot race approval.
    perform 1 from public.brokers where id=(select broker_id from public.properties where id=target_id) for update;
    select status::text into current_status from public.properties where id=target_id for update;
    if current_status is null or current_status<>expected_status then raise exception 'Record changed; refresh before reviewing'; end if;
    if decision='archived' then
      if current_status<>'approved' then raise exception 'Only published properties can be archived'; end if;
    elsif current_status<>'pending' then raise exception 'Only pending properties can be reviewed'; end if;
    if decision='approved' and not exists(select 1 from public.properties p join public.brokers b on b.id=p.broker_id where p.id=target_id and b.status='approved') then raise exception 'Broker is not approved'; end if;
    if decision='approved' and not exists(select 1 from public.property_images where property_id=target_id) then raise exception 'At least one image is required'; end if;
    update public.properties set status=decision::public.property_status where id=target_id;
    insert into public.moderation_events(actor_id,property_id,previous_status,new_status,reason)
    values(auth.uid(),target_id,current_status,decision,coalesce(reason,''));
  else raise exception 'Invalid entity'; end if;
end;
$$;
revoke all on function public.moderate_listing(text,uuid,text,text,text) from public, anon;
grant execute on function public.moderate_listing(text,uuid,text,text,text) to authenticated;

create function public.save_listing(payload jsonb, listing_id uuid, submit_review boolean, expected_updated_at timestamptz)
returns uuid language plpgsql security invoker set search_path='' as $$
declare owner_id uuid; saved_id uuid; listing public.properties; old_listing public.properties; images jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select id into owner_id from public.brokers where profile_id=auth.uid() and status='approved' for update;
  if owner_id is null then raise exception 'Approved broker required' using errcode='42501'; end if;
  images := coalesce(payload->'images','[]'::jsonb);
  if jsonb_typeof(images)<>'array' or jsonb_array_length(images)>20 then raise exception 'Invalid images'; end if;
  if submit_review and jsonb_array_length(images)=0 then raise exception 'At least one image is required'; end if;
  listing := jsonb_populate_record(null::public.properties,payload);
  if length(trim(coalesce(listing.title,''))) not between 3 and 150 or length(coalesce(listing.description,'')) not between 10 and 10000
     or length(trim(coalesce(listing.city,''))) not between 2 and 100 or length(trim(coalesce(listing.neighborhood,''))) not between 2 and 100
     or listing.property_type not in ('Apartamento','Casa','Terreno','Comercial','Rural')
     or listing.state not in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO') then raise exception 'Invalid property details'; end if;
  if listing_id is null then
    saved_id := gen_random_uuid();
    insert into public.properties(id,broker_id,slug,operation_type,property_type,title,description,price,city,state,neighborhood,address,area,bedrooms,suites,bathrooms,parking_spaces,condominium_fee,property_tax,features)
    values(saved_id,owner_id,'imovel-'||saved_id::text,listing.operation_type,listing.property_type,listing.title,listing.description,listing.price,listing.city,listing.state,listing.neighborhood,listing.address,listing.area,listing.bedrooms,listing.suites,listing.bathrooms,listing.parking_spaces,listing.condominium_fee,listing.property_tax,coalesce(listing.features,'{}'));
  else
    select * into old_listing from public.properties where id=listing_id and broker_id=owner_id for update;
    if old_listing.id is null or old_listing.status not in ('draft','changes_requested') then raise exception 'Property cannot be edited' using errcode='42501'; end if;
    if expected_updated_at is null or old_listing.updated_at<>expected_updated_at then raise exception 'Property changed; refresh before saving' using errcode='40001'; end if;
    saved_id := listing_id;
    update public.properties set operation_type=listing.operation_type,property_type=listing.property_type,title=listing.title,description=listing.description,price=listing.price,city=listing.city,state=listing.state,neighborhood=listing.neighborhood,address=listing.address,area=listing.area,bedrooms=listing.bedrooms,suites=listing.suites,bathrooms=listing.bathrooms,parking_spaces=listing.parking_spaces,condominium_fee=listing.condominium_fee,property_tax=listing.property_tax,features=coalesce(listing.features,'{}') where id=saved_id;
  end if;
  delete from public.property_images where property_id=saved_id;
  insert into public.property_images(property_id,url,alt,position)
  select saved_id,value#>>'{}',listing.title,(ordinality-1)::integer from jsonb_array_elements(images) with ordinality;
  if submit_review then update public.properties set status='pending' where id=saved_id; end if;
  return saved_id;
end;
$$;
revoke all on function public.save_listing(jsonb,uuid,boolean,timestamptz) from public, anon;
grant execute on function public.save_listing(jsonb,uuid,boolean,timestamptz) to authenticated;
commit;
