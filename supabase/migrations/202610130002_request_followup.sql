begin;
alter table public.property_requests add column status text not null default 'new' check(status in ('new','in_progress','completed')), add column updated_at timestamptz not null default now(), add column handled_by uuid references public.profiles(id) on delete set null;
alter table public.property_search_requests add column status text not null default 'new' check(status in ('new','in_progress','completed')), add column updated_at timestamptz not null default now(), add column handled_by uuid references public.profiles(id) on delete set null;
create function public.initialize_request_followup() returns trigger language plpgsql set search_path='' as $$ begin new.status:='new'; new.updated_at:=now(); new.handled_by:=null; return new; end; $$;
revoke all on function public.initialize_request_followup() from public;
create trigger request_followup_initial before insert on public.property_requests for each row execute function public.initialize_request_followup();
create trigger search_followup_initial before insert on public.property_search_requests for each row execute function public.initialize_request_followup();
create function public.update_request_followup(kind text,target_id uuid,expected_updated_at timestamptz,decision text) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); request_updated_at timestamptz; current_status text;
begin
 if actor is null or decision is null or decision not in ('new','in_progress','completed') or expected_updated_at is null then raise exception 'Invalid request' using errcode='42501'; end if;
 if kind='search' then
  if not public.is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
  select updated_at,status into request_updated_at,current_status from public.property_search_requests where id=target_id for update;
 elsif kind='contact' then
  if not public.is_admin() and not exists(select 1 from public.property_requests r join public.properties p on p.id=r.property_id join public.brokers b on b.id=p.broker_id where r.id=target_id and b.profile_id=actor and b.status='approved') then raise exception 'Not authorized' using errcode='42501'; end if;
  select updated_at,status into request_updated_at,current_status from public.property_requests where id=target_id for update;
 else raise exception 'Invalid request' using errcode='42501'; end if;
 if request_updated_at is null or request_updated_at<>expected_updated_at then raise exception 'Request changed; refresh' using errcode='40001'; end if;
 if current_status=decision then return; end if;
 if kind='search' then update public.property_search_requests set status=decision,updated_at=clock_timestamp(),handled_by=actor where id=target_id;
 else update public.property_requests set status=decision,updated_at=clock_timestamp(),handled_by=actor where id=target_id; end if;
end; $$;
revoke all on function public.update_request_followup(text,uuid,timestamptz,text) from public;
grant execute on function public.update_request_followup(text,uuid,timestamptz,text) to authenticated;
commit;
