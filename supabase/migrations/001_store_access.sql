-- Merchant roles, profiles, stores, memberships, and multi-store access rules.

do $$
begin
  create type public.store_member_role as enum ('owner', 'admin', 'staff');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_path text,
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_members (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.store_member_role not null default 'staff',
  created_at timestamptz not null default now(),
  unique (store_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.add_store_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.store_members (store_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (store_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_store_created on public.stores;
create trigger on_store_created
  after insert on public.stores
  for each row execute procedure public.add_store_owner();

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_platform_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.has_store_role(
  target_store_id uuid,
  accepted_roles public.store_member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.store_members
    where store_id = target_store_id and user_id = auth.uid() and role = any (accepted_roles)
  );
$$;

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.store_members enable row level security;

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.stores to authenticated;
grant select, insert, update, delete on public.store_members to authenticated;

create policy "Users can view their own profile" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_platform_admin());
create policy "Users can update their own profile" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_platform_admin())
  with check (id = auth.uid() or public.is_platform_admin());
create policy "Store members can view their stores" on public.stores for select to authenticated
  using (public.is_platform_admin() or public.has_store_role(id, array['owner', 'admin', 'staff']::public.store_member_role[]));
create policy "Users can create a store for themselves" on public.stores for insert to authenticated
  with check (owner_id = auth.uid() or public.is_platform_admin());
create policy "Store owners can update their stores" on public.stores for update to authenticated
  using (public.is_platform_admin() or public.has_store_role(id, array['owner']::public.store_member_role[]))
  with check (public.is_platform_admin() or owner_id = auth.uid());
create policy "Store members can view their membership" on public.store_members for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin() or public.has_store_role(store_id, array['owner', 'admin']::public.store_member_role[]));
create policy "Store owners can add members" on public.store_members for insert to authenticated
  with check (public.is_platform_admin() or public.has_store_role(store_id, array['owner']::public.store_member_role[]));
create policy "Store owners can update members" on public.store_members for update to authenticated
  using (public.is_platform_admin() or public.has_store_role(store_id, array['owner']::public.store_member_role[]))
  with check (public.is_platform_admin() or public.has_store_role(store_id, array['owner']::public.store_member_role[]));
create policy "Store owners can remove members" on public.store_members for delete to authenticated
  using (public.is_platform_admin() or public.has_store_role(store_id, array['owner']::public.store_member_role[]));
