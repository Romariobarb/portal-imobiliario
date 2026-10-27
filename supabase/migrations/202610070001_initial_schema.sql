begin;
create type public.user_role as enum ('client', 'broker', 'admin');
create type public.broker_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.property_status as enum ('draft', 'pending', 'approved', 'changes_requested', 'rejected', 'archived');
create type public.operation_type as enum ('sale', 'rent');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text not null default '', phone text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.brokers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  status public.broker_status not null default 'pending',
  creci text not null unique check (length(trim(creci)) > 0), bio text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status public.property_status not null default 'draft',
  operation_type public.operation_type not null,
  property_type text not null, title text not null check (length(trim(title)) > 0),
  description text not null default '', price numeric(14,2) not null check (price >= 0),
  city text not null, state text not null check (state ~ '^[A-Z]{2}$'),
  neighborhood text not null, address text, area numeric(12,2) not null check (area >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  suites integer not null default 0 check (suites >= 0 and suites <= bedrooms),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  parking_spaces integer not null default 0 check (parking_spaces >= 0),
  condominium_fee numeric(14,2) check (condominium_fee >= 0),
  property_tax numeric(14,2) check (property_tax >= 0),
  features text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint approved_has_publication check (status <> 'approved' or published_at is not null)
);
create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null check (url ~ '^https://'), alt text,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(), unique (property_id, position)
);
-- SolicitaÃ§Ãµes de contato; a moderaÃ§Ã£o Ã© representada pelo status do imÃ³vel.
create table public.property_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (length(trim(message)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index properties_broker_idx on public.properties(broker_id);
create index properties_catalog_idx on public.properties(city, operation_type, published_at desc) where status = 'approved';
create index property_requests_property_idx on public.property_requests(property_id);
create index property_requests_client_idx on public.property_requests(client_id);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create function public.initialize_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;
revoke all on function public.initialize_profile() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.initialize_profile();
-- Backfill users present before this migration; never trust metadata for roles.
insert into public.profiles(id, full_name)
select id, coalesce(raw_user_meta_data->>'full_name', '') from auth.users on conflict (id) do nothing;

create function public.guard_mutation() returns trigger
language plpgsql set search_path = '' as $$
begin
  -- SQL migrations / trusted service operations have no user JWT.
  if auth.uid() is not null and not public.is_admin() then
    if tg_table_name = 'profiles' then
      if new.id <> old.id or new.role <> old.role then raise exception 'Profile identity and role are protected'; end if;
    elsif tg_table_name = 'brokers' then
      if tg_op = 'INSERT' then
        if new.status <> 'pending' then raise exception 'Broker must start pending'; end if;
      elsif new.id <> old.id or new.profile_id <> old.profile_id or new.status <> old.status then
        raise exception 'Broker identity and moderation are protected';
      end if;
    elsif tg_table_name = 'properties' then
      if tg_op = 'INSERT' then
        if new.status <> 'draft' or new.published_at is not null then raise exception 'Property must start draft'; end if;
      else
        if new.id <> old.id or new.broker_id <> old.broker_id or new.published_at is distinct from old.published_at then
          raise exception 'Property identity and publication are protected';
        end if;
        if old.status not in ('draft', 'changes_requested') or (new.status <> old.status and new.status not in ('draft', 'pending')) then
          raise exception 'Only editable properties may be changed or submitted';
        end if;
      end if;
    end if;
  end if;
  if tg_op = 'UPDATE' then new.created_at := old.created_at; end if;
  new.updated_at := now();
  if tg_table_name = 'properties' then
    if new.status = 'approved' and new.published_at is null then new.published_at := now(); end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_mutation() from public;
create trigger profiles_guard before update on public.profiles for each row execute function public.guard_mutation();
create trigger brokers_guard before insert or update on public.brokers for each row execute function public.guard_mutation();
create trigger properties_guard before insert or update on public.properties for each row execute function public.guard_mutation();

alter table public.profiles enable row level security;
alter table public.brokers enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_requests enable row level security;
-- Explicit grants: anonymous users cannot write; requests are immutable.
revoke all on public.profiles, public.brokers, public.properties, public.property_images, public.property_requests from anon, authenticated;
grant select on public.brokers, public.properties, public.property_images to anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.brokers, public.properties, public.property_images to authenticated;
grant delete on public.property_images to authenticated;
grant select, insert on public.property_requests to authenticated;

create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy profiles_update on public.profiles for update to authenticated using (id = (select auth.uid()) or public.is_admin()) with check (id = (select auth.uid()) or public.is_admin());
create policy brokers_read on public.brokers for select to anon, authenticated using (status = 'approved' or profile_id = (select auth.uid()) or public.is_admin());
create policy brokers_insert on public.brokers for insert to authenticated with check ((profile_id = (select auth.uid()) and status = 'pending') or public.is_admin());
create policy brokers_update on public.brokers for update to authenticated using (profile_id = (select auth.uid()) or public.is_admin()) with check (profile_id = (select auth.uid()) or public.is_admin());
create policy properties_read on public.properties for select to anon, authenticated using (
  public.is_admin() or exists (select 1 from public.brokers b where b.id = broker_id and
    (b.profile_id = (select auth.uid()) or (b.status = 'approved' and properties.status = 'approved')))
);
create policy properties_insert on public.properties for insert to authenticated with check (
  public.is_admin() or (status = 'draft' and exists (select 1 from public.brokers b where b.id = broker_id and b.profile_id = (select auth.uid()) and b.status = 'approved'))
);
create policy properties_update on public.properties for update to authenticated using (
  public.is_admin() or (status in ('draft', 'changes_requested') and exists (select 1 from public.brokers b where b.id = broker_id and b.profile_id = (select auth.uid()) and b.status = 'approved'))
) with check (
  public.is_admin() or (status in ('draft', 'pending', 'changes_requested') and exists (select 1 from public.brokers b where b.id = broker_id and b.profile_id = (select auth.uid()) and b.status = 'approved'))
);
create policy images_read on public.property_images for select to anon, authenticated using (exists (select 1 from public.properties p where p.id = property_id));
create policy images_write on public.property_images for all to authenticated using (
  public.is_admin() or exists (select 1 from public.properties p join public.brokers b on b.id = p.broker_id where p.id = property_id and p.status in ('draft', 'changes_requested') and b.profile_id = (select auth.uid()) and b.status = 'approved')
) with check (
  public.is_admin() or exists (select 1 from public.properties p join public.brokers b on b.id = p.broker_id where p.id = property_id and p.status in ('draft', 'changes_requested') and b.profile_id = (select auth.uid()) and b.status = 'approved')
);
create policy requests_read on public.property_requests for select to authenticated using (
  client_id = (select auth.uid()) or public.is_admin() or exists (select 1 from public.properties p join public.brokers b on b.id = p.broker_id where p.id = property_id and b.profile_id = (select auth.uid()) and b.status = 'approved')
);
create policy requests_insert on public.property_requests for insert to authenticated with check (
  client_id = (select auth.uid()) and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'client')
  and exists (select 1 from public.properties p join public.brokers b on b.id = p.broker_id where p.id = property_id and p.status = 'approved' and b.status = 'approved')
);
commit;
