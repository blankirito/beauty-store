-- Restore the public-store eligibility guard that existed before
-- payment-method QR paths were added.

drop function if exists public.get_public_store_payment_methods(text);

drop function if exists public.get_public_store_payment_methods_unchecked(text);

create function public.get_public_store_payment_methods_unchecked(
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

revoke all on function public.get_public_store_payment_methods_unchecked(text)
from public, anon, authenticated;

create function public.get_public_store_payment_methods(
  p_store_slug text
)
returns table (
  id uuid,
  label text,
  instructions text,
  qr_image_path text
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