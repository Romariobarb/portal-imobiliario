begin;
create table public.creci_checks (
 id uuid primary key default gen_random_uuid(), broker_id uuid not null references public.brokers(id),
 actor_id uuid not null references public.profiles(id), creci text not null, full_name text not null,
 registration_state text not null, result text not null check(result in ('confirmed','not_found','mismatch')),
 notes text not null check(length(trim(notes)) between 10 and 2000), created_at timestamptz not null default clock_timestamp()
);
create index creci_checks_broker_idx on public.creci_checks(broker_id,created_at desc);
alter table public.creci_checks enable row level security;
revoke all on public.creci_checks from anon,authenticated;
grant select on public.creci_checks to authenticated;
create policy creci_checks_read on public.creci_checks for select to authenticated using(public.is_admin() or exists(select 1 from public.brokers b where b.id=broker_id and b.profile_id=(select auth.uid())));
create function public.record_creci_check(target_id uuid,expected_updated_at timestamptz,expected_name text,result text,registration_state text,notes text)
returns void language plpgsql security definer set search_path='' as $$
declare b public.brokers; p public.profiles;
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
 select * into b from public.brokers where id=target_id for update;
 if b.id is null or expected_updated_at is null or b.updated_at<>expected_updated_at then raise exception 'Broker changed' using errcode='40001'; end if;
 select * into p from public.profiles where id=b.profile_id for share;
 if p.full_name is distinct from expected_name then raise exception 'Profile changed' using errcode='40001'; end if;
 if result not in ('confirmed','not_found','mismatch') or registration_state not in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO') or length(trim(coalesce(notes,''))) not between 10 and 2000 then raise exception 'Invalid verification'; end if;
 insert into public.creci_checks(broker_id,actor_id,creci,full_name,registration_state,result,notes) values(b.id,auth.uid(),b.creci,p.full_name,registration_state,result,trim(notes));
end $$;
revoke all on function public.record_creci_check(uuid,timestamptz,text,text,text,text) from public,anon;
grant execute on function public.record_creci_check(uuid,timestamptz,text,text,text,text) to authenticated;
create function public.require_creci_check() returns trigger language plpgsql security definer set search_path='' as $$
declare latest public.creci_checks;
begin
 if new.status='approved' and old.status is distinct from new.status then
  select * into latest from public.creci_checks where broker_id=new.id order by created_at desc,id desc limit 1;
  if latest.id is null or latest.result<>'confirmed' or latest.creci is distinct from new.creci or latest.full_name is distinct from (select full_name from public.profiles where id=new.profile_id) then
   raise exception 'Record a matching CRECI verification before approval' using errcode='23514';
  end if;
 end if;
 return new;
end $$;
revoke all on function public.require_creci_check() from public;
create trigger brokers_creci_check before update on public.brokers for each row execute function public.require_creci_check();
commit;
