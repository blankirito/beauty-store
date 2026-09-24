create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (char_length(btrim(label)) > 0),
  recipient_name text not null check (char_length(btrim(recipient_name)) > 0),
  phone text not null check (char_length(btrim(phone)) > 0),
  address_line_1 text not null check (char_length(btrim(address_line_1)) > 0),
  address_line_2 text,
  city text not null check (char_length(btrim(city)) > 0),
  state text not null check (char_length(btrim(state)) > 0),
  postal_code text not null check (char_length(btrim(postal_code)) > 0),
  country text not null default 'Malaysia'
    check (char_length(btrim(country)) > 0),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index customer_addresses_one_default_per_user
on public.customer_addresses (user_id)
where is_default;

alter table public.customer_addresses enable row level security;

create policy "Customers can view their addresses"
on public.customer_addresses
for select
to authenticated
using (auth.uid() = user_id);

create policy "Customers can add their addresses"
on public.customer_addresses
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Customers can update their addresses"
on public.customer_addresses
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Customers can delete their addresses"
on public.customer_addresses
for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete
on table public.customer_addresses
to authenticated;

create or replace function public.manage_customer_address_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if (
      select count(*)
      from public.customer_addresses
      where user_id = new.user_id
    ) >= 5 then
      raise exception 'You can save up to five addresses.';
    end if;

    if not exists (
      select 1
      from public.customer_addresses
      where user_id = new.user_id
    ) then
      new.is_default := true;
    end if;
  end if;

  if new.is_default then
    update public.customer_addresses
    set is_default = false
    where user_id = new.user_id
      and id is distinct from new.id
      and is_default = true;
  end if;

  return new;
end;
$$;

create trigger manage_customer_address_defaults
before insert or update
on public.customer_addresses
for each row
execute function public.manage_customer_address_defaults();

create or replace function public.assign_new_default_customer_address()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.is_default then
    update public.customer_addresses
    set is_default = true
    where id = (
      select id
      from public.customer_addresses
      where user_id = old.user_id
      order by created_at asc
      limit 1
    );
  end if;

  return old;
end;
$$;

create trigger assign_new_default_customer_address
after delete
on public.customer_addresses
for each row
execute function public.assign_new_default_customer_address();

create trigger set_customer_addresses_updated_at
before update
on public.customer_addresses
for each row
execute function public.set_updated_at();