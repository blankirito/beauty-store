create table public.store_payment_methods (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  code text not null,
  label text not null check (btrim(label) <> ''),
  instructions text,
  is_enabled boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, code)
);

create index store_payment_methods_store_id_sort_order_idx
  on public.store_payment_methods (store_id, sort_order);

create trigger set_store_payment_methods_updated_at
before update on public.store_payment_methods
for each row
execute function public.set_updated_at();

alter table public.store_payment_methods enable row level security;

create policy "Authenticated customers can view enabled payment methods"
on public.store_payment_methods
for select
to authenticated
using (
  is_enabled
  or public.is_platform_admin()
  or public.has_store_role(
    store_id,
    array['owner', 'admin', 'staff']::public.store_member_role[]
  )
);

create policy "Store owners and admins can create payment methods"
on public.store_payment_methods
for insert
to authenticated
with check (
  public.is_platform_admin()
  or public.has_store_role(
    store_id,
    array['owner', 'admin']::public.store_member_role[]
  )
);

create policy "Store owners and admins can update payment methods"
on public.store_payment_methods
for update
to authenticated
using (
  public.is_platform_admin()
  or public.has_store_role(
    store_id,
    array['owner', 'admin']::public.store_member_role[]
  )
)
with check (
  public.is_platform_admin()
  or public.has_store_role(
    store_id,
    array['owner', 'admin']::public.store_member_role[]
  )
);

insert into public.store_payment_methods (
  store_id,
  code,
  label,
  instructions,
  is_enabled,
  sort_order
)
select
  stores.id,
  'cash_on_delivery',
  'Cash on Delivery',
  'Pay when your order is delivered.',
  true,
  0
from public.stores
where not exists (
  select 1
  from public.store_payment_methods
  where store_payment_methods.store_id = stores.id
    and store_payment_methods.code = 'cash_on_delivery'
);

insert into public.store_payment_methods (
  store_id,
  code,
  label,
  instructions,
  is_enabled,
  sort_order
)
select
  stores.id,
  'bank_transfer',
  'Bank Transfer',
  'Transfer payment using the instructions provided by the store.',
  true,
  1
from public.stores
where not exists (
  select 1
  from public.store_payment_methods
  where store_payment_methods.store_id = stores.id
    and store_payment_methods.code = 'bank_transfer'
);