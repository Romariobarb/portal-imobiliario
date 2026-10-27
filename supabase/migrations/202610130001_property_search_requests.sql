begin;
create table public.property_search_requests (
 id uuid primary key default gen_random_uuid(),
 client_id uuid not null references public.profiles(id) on delete cascade,
 operation_type public.operation_type not null,
 property_type text not null check(length(trim(property_type)) between 2 and 80),
 city text not null check(length(trim(city)) between 2 and 100),
 state text not null check(state in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO')),
 budget numeric not null check(budget>0 and budget<=1000000000000),
 bedrooms integer not null check(bedrooms between 0 and 100),
 message text not null check(length(trim(message)) between 10 and 5000),
 created_at timestamptz not null default now()
);
create index property_search_requests_client_idx on public.property_search_requests(client_id,created_at desc);
alter table public.property_search_requests enable row level security;
revoke all on public.property_search_requests from anon,authenticated;
grant select,insert on public.property_search_requests to authenticated;
create policy search_requests_read on public.property_search_requests for select to authenticated using(client_id=(select auth.uid()) or public.is_admin());
create policy search_requests_insert on public.property_search_requests for insert to authenticated with check(client_id=(select auth.uid()) and exists(select 1 from public.profiles where id=(select auth.uid()) and role='client'));
commit;
