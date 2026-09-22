create extension if not exists pgcrypto with schema extensions;

alter table public.orders
  add column if not exists payment_method_id uuid
    references public.store_payment_methods(id) on delete set null;

alter table public.orders
  add column if not exists payment_method_label text;

alter table public.orders
  add column if not exists payment_method_instructions text;

alter table public.orders
  add column if not exists guest_access_token_hash text;

create unique index if not exists orders_guest_access_token_hash_idx
  on public.orders (guest_access_token_hash)
  where guest_access_token_hash is not null;

create or replace function public.create_guest_checkout_order(
  p_store_slug text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_address_line_1 text,
  p_address_line_2 text,
  p_city text,
  p_state text,
  p_postal_code text,
  p_country text,
  p_payment_method_id uuid,
  p_items jsonb
)
returns table (
  order_id uuid,
  order_number text,
  tracking_token text,
  payment_method_label text,
  payment_instructions text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_store public.stores;
  v_payment_method public.store_payment_methods;
  v_order public.orders;
  v_item record;
  v_requested_item_count integer;
  v_processed_item_count integer := 0;
  v_subtotal numeric(10, 2) := 0;
  v_raw_tracking_token text;
  v_tracking_token_hash text;
begin
  if jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as item
    where coalesce(btrim(item ->> 'productId'), '') = ''
      or coalesce(item ->> 'quantity', '') !~ '^[1-9][0-9]*$'
  ) then
    raise exception 'Your cart contains an invalid item.';
  end if;

  if btrim(p_customer_name) = ''
    or btrim(p_customer_email) = ''
    or btrim(p_customer_phone) = ''
    or btrim(p_address_line_1) = ''
    or btrim(p_city) = ''
    or btrim(p_state) = ''
    or btrim(p_postal_code) = ''
    or btrim(p_country) = '' then
    raise exception 'Complete all required checkout details.';
  end if;

  if position('@' in btrim(p_customer_email)) = 0 then
    raise exception 'Enter a valid email.';
  end if;

  select *
  into v_store
  from public.stores
  where slug = lower(btrim(p_store_slug));

  if not found then
    raise exception 'Store not found.';
  end if;

  select *
  into v_payment_method
  from public.store_payment_methods
  where id = p_payment_method_id
    and store_id = v_store.id
    and is_enabled = true
  for update;

  if not found then
    raise exception 'Choose an available payment method.';
  end if;

  select count(distinct item ->> 'productId')
  into v_requested_item_count
  from jsonb_array_elements(p_items) as item;

  for v_item in
    with requested_items as (
      select
        (item ->> 'productId')::uuid as product_id,
        sum((item ->> 'quantity')::integer)::integer as quantity
      from jsonb_array_elements(p_items) as item
      group by item ->> 'productId'
    )
    select
      products.id,
      products.name,
      products.sku,
      products.price,
      products.stock,
      requested_items.quantity
    from public.products
    join requested_items
      on requested_items.product_id = products.id
    where products.store_id = v_store.id
      and products.is_active = true
    for update of products
  loop
    v_processed_item_count := v_processed_item_count + 1;

    if v_item.stock < v_item.quantity then
      raise exception 'Not enough stock for %.', v_item.name;
    end if;

    v_subtotal := v_subtotal + (v_item.price * v_item.quantity);
  end loop;

  if v_processed_item_count <> v_requested_item_count then
    raise exception 'One or more cart products are unavailable.';
  end if;

  v_raw_tracking_token :=
    replace(gen_random_uuid()::text, '-', '')
    || replace(gen_random_uuid()::text, '-', '');

  v_tracking_token_hash :=
    encode(extensions.digest(v_raw_tracking_token, 'sha256'), 'hex');

  insert into public.orders (
    store_id,
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    payment_status,
    fulfillment_status,
    payment_method,
    payment_method_id,
    payment_method_label,
    payment_method_instructions,
    guest_access_token_hash,
    subtotal,
    shipping_fee,
    total
  )
  values (
    v_store.id,
    public.next_order_number(),
    btrim(p_customer_name),
    lower(btrim(p_customer_email)),
    btrim(p_customer_phone),
    'pending',
    'new',
    v_payment_method.code,
    v_payment_method.id,
    v_payment_method.label,
    v_payment_method.instructions,
    v_tracking_token_hash,
    v_subtotal,
    0,
    v_subtotal
  )
  returning *
  into v_order;

  for v_item in
    with requested_items as (
      select
        (item ->> 'productId')::uuid as product_id,
        sum((item ->> 'quantity')::integer)::integer as quantity
      from jsonb_array_elements(p_items) as item
      group by item ->> 'productId'
    )
    select
      products.id,
      products.name,
      products.sku,
      products.price,
      requested_items.quantity
    from public.products
    join requested_items
      on requested_items.product_id = products.id
    where products.store_id = v_store.id
      and products.is_active = true
  loop
    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      product_sku,
      unit_price,
      quantity,
      line_total
    )
    values (
      v_order.id,
      v_item.id,
      v_item.name,
      v_item.sku,
      v_item.price,
      v_item.quantity,
      v_item.price * v_item.quantity
    );

    update public.products
    set stock = stock - v_item.quantity
    where id = v_item.id;
  end loop;

  insert into public.order_shipping_addresses (
    order_id,
    recipient_name,
    phone,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    country
  )
  values (
    v_order.id,
    v_order.customer_name,
    v_order.customer_phone,
    btrim(p_address_line_1),
    nullif(btrim(p_address_line_2), ''),
    btrim(p_city),
    btrim(p_state),
    btrim(p_postal_code),
    btrim(p_country)
  );

  insert into public.order_events (
    order_id,
    fulfillment_status,
    title,
    note
  )
  values (
    v_order.id,
    'new',
    'Order placed',
    'Guest checkout order created.'
  );

  return query
  select
    v_order.id,
    v_order.order_number,
    v_raw_tracking_token,
    v_payment_method.label,
    coalesce(v_payment_method.instructions, '');
end;
$$;

grant execute on function public.create_guest_checkout_order(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  uuid,
  jsonb
) to anon, authenticated;