create or replace function public.get_public_store_payment_methods(
  p_store_slug text
)
returns table (
  id uuid,
  label text,
  instructions text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    payment_methods.id,
    payment_methods.label,
    coalesce(payment_methods.instructions, '')
  from public.store_payment_methods as payment_methods
  join public.stores
    on stores.id = payment_methods.store_id
  where stores.slug = lower(btrim(p_store_slug))
    and payment_methods.is_enabled = true
  order by payment_methods.sort_order, payment_methods.created_at;
$$;

grant execute on function public.get_public_store_payment_methods(text)
  to anon, authenticated;