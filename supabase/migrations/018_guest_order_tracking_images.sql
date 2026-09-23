create or replace function public.get_guest_order_tracking_unchecked(
  p_store_slug text,
  p_order_number text,
  p_tracking_token text
)
returns table (
  order_number text,
  customer_name text,
  payment_status text,
  fulfillment_status text,
  payment_method_label text,
  payment_method_instructions text,
  subtotal numeric,
  shipping_fee numeric,
  total numeric,
  tracking_carrier text,
  tracking_number text,
  estimated_delivery_date date,
  created_at timestamptz,
  shipping_address jsonb,
  items jsonb,
  events jsonb
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    orders.order_number,
    orders.customer_name,
    orders.payment_status,
    orders.fulfillment_status,
    coalesce(orders.payment_method_label, orders.payment_method, ''),
    coalesce(orders.payment_method_instructions, ''),
    orders.subtotal,
    orders.shipping_fee,
    orders.total,
    orders.tracking_carrier,
    orders.tracking_number,
    orders.estimated_delivery_date,
    orders.created_at,

    (
      select jsonb_build_object(
        'recipientName', addresses.recipient_name,
        'phone', addresses.phone,
        'addressLine1', addresses.address_line_1,
        'addressLine2', addresses.address_line_2,
        'city', addresses.city,
        'state', addresses.state,
        'postalCode', addresses.postal_code,
        'country', addresses.country
      )
      from public.order_shipping_addresses as addresses
      where addresses.order_id = orders.id
    ),

    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'name', items.product_name,
            'sku', items.product_sku,
            'unitPrice', items.unit_price,
            'quantity', items.quantity,
            'lineTotal', items.line_total,
            'imagePath', (
              select product_images.storage_path
              from public.product_images
              where product_images.product_id = items.product_id
              order by product_images.is_primary desc, product_images.sort_order asc
              limit 1
            )
          )
          order by items.created_at
        )
        from public.order_items as items
        where items.order_id = orders.id
      ),
      '[]'::jsonb
    ),

    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'title', events.title,
            'note', events.note,
            'fulfillmentStatus', events.fulfillment_status,
            'createdAt', events.created_at
          )
          order by events.created_at
        )
        from public.order_events as events
        where events.order_id = orders.id
      ),
      '[]'::jsonb
    )

  from public.orders
  join public.stores
    on stores.id = orders.store_id
  where stores.slug = lower(btrim(p_store_slug))
    and orders.order_number = btrim(p_order_number)
    and orders.guest_access_token_hash =
      encode(
        extensions.digest(p_tracking_token, 'sha256'),
        'hex'
      );
$$;
