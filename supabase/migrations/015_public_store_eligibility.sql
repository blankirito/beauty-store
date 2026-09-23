-- Public-store eligibility.
-- Apply this immediately after 014 in the same Supabase SQL Editor run.

drop policy if exists "Public can view active products" on public.products;

create policy "Public can view active products"
  on public.products
  for select
  to anon, authenticated
  using (
    (
      is_active = true
      and public.is_public_store_eligible(store_id)
    )
    or public.is_platform_admin()
    or public.has_store_role(
      store_id,
      array['owner', 'admin', 'staff']::public.store_member_role[]
    )
  );

drop policy if exists "Public can view images of active products"
  on public.product_images;

create policy "Public can view images of active products"
  on public.product_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_images.product_id
        and (
          (
            products.is_active = true
            and public.is_public_store_eligible(products.store_id)
          )
          or public.is_platform_admin()
          or public.has_store_role(
            products.store_id,
            array['owner', 'admin', 'staff']::public.store_member_role[]
          )
        )
    )
  );

alter function public.get_public_storefront(text)
  rename to get_public_storefront_unchecked;

revoke all on function public.get_public_storefront_unchecked(text)
  from public, anon, authenticated;

create function public.get_public_storefront(
  p_store_slug text
)
returns table (
  id uuid,
  name text,
  slug text,
  description text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.stores
    where stores.slug = lower(btrim(p_store_slug))
      and public.is_public_store_eligible(stores.id)
  ) then
    return;
  end if;

  return query
  select *
  from public.get_public_storefront_unchecked(p_store_slug);
end;
$$;

revoke all on function public.get_public_storefront(text)
  from public;

grant execute on function public.get_public_storefront(text)
  to anon, authenticated;

alter function public.get_public_store_payment_methods(text)
  rename to get_public_store_payment_methods_unchecked;

revoke all on function public.get_public_store_payment_methods_unchecked(text)
  from public, anon, authenticated;

create function public.get_public_store_payment_methods(
  p_store_slug text
)
returns table (
  id uuid,
  label text,
  instructions text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.stores
    where stores.slug = lower(btrim(p_store_slug))
      and public.is_public_store_eligible(stores.id)
  ) then
    return;
  end if;

  return query
  select *
  from public.get_public_store_payment_methods_unchecked(p_store_slug);
end;
$$;

revoke all on function public.get_public_store_payment_methods(text)
  from public;

grant execute on function public.get_public_store_payment_methods(text)
  to anon, authenticated;

alter function public.create_guest_checkout_order(
  text, text, text, text, text, text, text, text, text, text, uuid, jsonb
)
rename to create_guest_checkout_order_unchecked;

revoke all on function public.create_guest_checkout_order_unchecked(
  text, text, text, text, text, text, text, text, text, text, uuid, jsonb
) from public, anon, authenticated;

create function public.create_guest_checkout_order(
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
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.stores
    where stores.slug = lower(btrim(p_store_slug))
      and public.is_public_store_eligible(stores.id)
  ) then
    raise exception 'Store not found.';
  end if;

  return query
  select *
  from public.create_guest_checkout_order_unchecked(
    p_store_slug,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_address_line_1,
    p_address_line_2,
    p_city,
    p_state,
    p_postal_code,
    p_country,
    p_payment_method_id,
    p_items
  );
end;
$$;

revoke all on function public.create_guest_checkout_order(
  text, text, text, text, text, text, text, text, text, text, uuid, jsonb
) from public;

grant execute on function public.create_guest_checkout_order(
  text, text, text, text, text, text, text, text, text, text, uuid, jsonb
) to anon, authenticated;

alter function public.get_guest_order_tracking(text, text, text)
  rename to get_guest_order_tracking_unchecked;

revoke all on function public.get_guest_order_tracking_unchecked(
  text, text, text
) from public, anon, authenticated;

create function public.get_guest_order_tracking(
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
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.stores
    where stores.slug = lower(btrim(p_store_slug))
      and public.is_public_store_eligible(stores.id)
  ) then
    return;
  end if;

  return query
  select *
  from public.get_guest_order_tracking_unchecked(
    p_store_slug,
    p_order_number,
    p_tracking_token
  );
end;
$$;

revoke all on function public.get_guest_order_tracking(text, text, text)
  from public;

grant execute on function public.get_guest_order_tracking(text, text, text)
  to anon, authenticated;