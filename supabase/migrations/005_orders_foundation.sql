-- Orders foundation: order snapshots, shipping addresses, event timeline,
-- store-scoped access, and future checkout support.

create sequence if not exists public.order_number_sequence
  start with 1000;

create or replace function public.next_order_number()
returns text
language sql
volatile
set search_path = public
as $$
  select 'ORD-' || lpad(
    nextval('public.order_number_sequence')::text,
    6,
    '0'
  );
$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null
    references public.stores(id) on delete cascade,
  customer_id uuid
    references public.profiles(id) on delete set null,
  order_number text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  fulfillment_status text not null default 'new'
    check (
      fulfillment_status in (
        'new',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      )
    ),
  payment_method text,
  subtotal numeric(10, 2) not null default 0
    check (subtotal >= 0),
  shipping_fee numeric(10, 2) not null default 0
    check (shipping_fee >= 0),
  total numeric(10, 2) not null default 0
    check (total >= 0),
  tracking_carrier text,
  tracking_number text,
  estimated_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, order_number)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null
    references public.orders(id) on delete cascade,
  product_id uuid
    references public.products(id) on delete set null,
  product_name text not null,
  product_sku text not null,
  unit_price numeric(10, 2) not null
    check (unit_price >= 0),
  quantity integer not null
    check (quantity > 0),
  line_total numeric(10, 2) not null
    check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_shipping_addresses (
  order_id uuid primary key
    references public.orders(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null
    references public.orders(id) on delete cascade,
  fulfillment_status text
    check (
      fulfillment_status is null
      or fulfillment_status in (
        'new',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      )
    ),
  title text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists orders_store_created_at_idx
  on public.orders (store_id, created_at desc);

create index if not exists orders_customer_created_at_idx
  on public.orders (customer_id, created_at desc);

create index if not exists orders_store_fulfillment_status_idx
  on public.orders (store_id, fulfillment_status);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create index if not exists order_events_order_created_at_idx
  on public.order_events (order_id, created_at);

drop trigger if exists set_orders_updated_at on public.orders;

create trigger set_orders_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_shipping_addresses enable row level security;
alter table public.order_events enable row level security;

grant select, insert, update on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant select, insert, update on public.order_shipping_addresses to authenticated;
grant select, insert on public.order_events to authenticated;

drop policy if exists "Customers and store staff can view orders"
on public.orders;

create policy "Customers and store staff can view orders"
on public.orders
for select
to authenticated
using (
  customer_id = auth.uid()
  or public.is_platform_admin()
  or public.has_store_role(
    store_id,
    array['owner', 'admin', 'staff']::public.store_member_role[]
  )
);

drop policy if exists "Store owners and admins can create orders"
on public.orders;

create policy "Store owners and admins can create orders"
on public.orders
for insert
to authenticated
with check (
  public.is_platform_admin()
  or public.has_store_role(
    store_id,
    array['owner', 'admin']::public.store_member_role[]
  )
);

drop policy if exists "Store owners and admins can update orders"
on public.orders;

create policy "Store owners and admins can update orders"
on public.orders
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

drop policy if exists "Customers and store staff can view order items"
on public.order_items;

create policy "Customers and store staff can view order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (
        orders.customer_id = auth.uid()
        or public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin', 'staff']::public.store_member_role[]
        )
      )
  )
);

drop policy if exists "Store owners and admins can create order items"
on public.order_items;

create policy "Store owners and admins can create order items"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (
        public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin']::public.store_member_role[]
        )
      )
  )
);

drop policy if exists "Customers and store staff can view order addresses"
on public.order_shipping_addresses;

create policy "Customers and store staff can view order addresses"
on public.order_shipping_addresses
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_shipping_addresses.order_id
      and (
        orders.customer_id = auth.uid()
        or public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin', 'staff']::public.store_member_role[]
        )
      )
  )
);

drop policy if exists "Store owners and admins can create order addresses"
on public.order_shipping_addresses;

create policy "Store owners and admins can create order addresses"
on public.order_shipping_addresses
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_shipping_addresses.order_id
      and (
        public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin']::public.store_member_role[]
        )
      )
  )
);

drop policy if exists "Store owners and admins can update order addresses"
on public.order_shipping_addresses;

create policy "Store owners and admins can update order addresses"
on public.order_shipping_addresses
for update
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_shipping_addresses.order_id
      and (
        public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin']::public.store_member_role[]
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_shipping_addresses.order_id
      and (
        public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin']::public.store_member_role[]
        )
      )
  )
);

drop policy if exists "Customers and store staff can view order events"
on public.order_events;

create policy "Customers and store staff can view order events"
on public.order_events
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_events.order_id
      and (
        orders.customer_id = auth.uid()
        or public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin', 'staff']::public.store_member_role[]
        )
      )
  )
);

drop policy if exists "Store owners and admins can create order events"
on public.order_events;

create policy "Store owners and admins can create order events"
on public.order_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_events.order_id
      and (
        public.is_platform_admin()
        or public.has_store_role(
          orders.store_id,
          array['owner', 'admin']::public.store_member_role[]
        )
      )
  )
);