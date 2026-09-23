create or replace function public.update_store_application_draft(
  p_store_id uuid,
  p_name text,
  p_slug text,
  p_category text,
  p_contact_name text,
  p_contact_phone text,
  p_description text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text := lower(btrim(p_slug));
  v_status public.store_application_status;
begin
  if not public.has_store_role(
    p_store_id,
    array['owner']::public.store_member_role[]
  ) then
    raise exception 'You cannot edit this store application.';
  end if;

  select status
  into v_status
  from public.store_applications
  where store_id = p_store_id
  for update;

  if not found or v_status not in ('draft', 'rejected') then
    raise exception 'Only a draft or rejected application can be edited.';
  end if;

  if btrim(p_name) = ''
    or v_slug = ''
    or btrim(p_category) = ''
    or btrim(p_contact_name) = ''
    or btrim(p_contact_phone) = ''
    or btrim(p_description) = '' then
    raise exception 'Complete all required store application details.';
  end if;

  if char_length(p_description) > 240 then
    raise exception 'Store description must be 240 characters or fewer.';
  end if;

  if v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Enter a valid store URL.';
  end if;

  if v_slug = any (
    array['admin', 'platform', 'login', 'register', 'onboarding', 'store']
  ) then
    raise exception 'This store URL is reserved.';
  end if;

  if exists (
    select 1
    from public.stores
    where slug = v_slug
      and id <> p_store_id
  ) then
    raise exception 'This store URL is already taken.';
  end if;

  update public.stores
  set
    name = btrim(p_name),
    slug = v_slug,
    description = btrim(p_description)
  where id = p_store_id;

  update public.store_applications
  set
    category = btrim(p_category),
    contact_name = btrim(p_contact_name),
    contact_phone = btrim(p_contact_phone),
    updated_at = now()
  where store_id = p_store_id;
end;
$$;

revoke all on function public.update_store_application_draft(
  uuid, text, text, text, text, text, text
) from public;

grant execute on function public.update_store_application_draft(
  uuid, text, text, text, text, text, text
) to authenticated;