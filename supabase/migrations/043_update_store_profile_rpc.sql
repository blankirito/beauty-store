create or replace function public.update_store_profile(
  p_store_id uuid,
  p_name text,
  p_slug text,
  p_description text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null
    or not public.has_store_role(
      p_store_id,
      array['owner', 'admin']::public.store_member_role[]
    ) then
    raise exception 'You do not have permission to update this store.';
  end if;

  update public.stores
  set
    name = p_name,
    slug = p_slug,
    description = p_description,
    updated_at = now()
  where id = p_store_id;

  if not found then
    raise exception 'Store not found.';
  end if;
end;
$$;

revoke all on function public.update_store_profile(uuid, text, text, text)
from public, anon, authenticated;

grant execute on function public.update_store_profile(uuid, text, text, text)
to authenticated;