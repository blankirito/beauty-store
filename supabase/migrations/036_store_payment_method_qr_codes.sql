alter table public.store_payment_methods
add column if not exists qr_image_path text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'payment-qr-codes',
  'payment-qr-codes',
  true,
  2097152,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- QR images are customer-readable, but browser clients receive no
-- Storage write policy. Uploads and removal use the server-only client.

drop policy if exists "Store owners and admins can upload payment QR codes"
on storage.objects;

drop policy if exists "Store owners and admins can update payment QR codes"
on storage.objects;

drop policy if exists "Store owners and admins can delete payment QR codes"
on storage.objects;

drop function if exists public.get_public_store_payment_methods(text);

create function public.get_public_store_payment_methods(
  p_store_slug text
)
returns table (
  id uuid,
  label text,
  instructions text,
  qr_image_path text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    payment_methods.id,
    payment_methods.label,
    coalesce(payment_methods.instructions, ''),
    payment_methods.qr_image_path
  from public.store_payment_methods as payment_methods
  join public.stores
    on stores.id = payment_methods.store_id
  where stores.slug = lower(btrim(p_store_slug))
    and payment_methods.is_enabled = true
  order by payment_methods.sort_order, payment_methods.created_at;
$$;

grant execute on function public.get_public_store_payment_methods(text)
to anon, authenticated;