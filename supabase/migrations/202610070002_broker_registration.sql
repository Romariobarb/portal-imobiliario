begin;
alter table public.brokers
  add column city text,
  add column state text check (state ~ '^[A-Z]{2}$');

-- Auth, profile and broker are created atomically, even with email confirmation.
-- Metadata supplies contact details only; role and status are fixed here.
create or replace function public.initialize_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  details jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  applicant boolean := coalesce(details->>'registration_kind', '') = 'broker';
begin
  if applicant then
    if length(trim(coalesce(details->>'full_name', ''))) not between 3 and 150
       or length(regexp_replace(coalesce(details->>'phone', ''), '[^0-9]', '', 'g')) not between 10 and 13
       or length(trim(coalesce(details->>'creci', ''))) not between 3 and 30
       or length(trim(coalesce(details->>'city', ''))) not between 2 and 100
       or coalesce(details->>'state', '') not in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO') then
      raise exception 'Invalid broker registration';
    end if;
  end if;
  insert into public.profiles(id, full_name, phone, role)
  values (new.id, coalesce(details->>'full_name', ''), details->>'phone',
    case when applicant then 'broker'::public.user_role else 'client'::public.user_role end);
  if applicant then
    insert into public.brokers(profile_id, creci, city, state, status)
    values (new.id, upper(trim(details->>'creci')), trim(details->>'city'), details->>'state', 'pending');
  end if;
  return new;
end;
$$;
revoke all on function public.initialize_profile() from public;
commit;
