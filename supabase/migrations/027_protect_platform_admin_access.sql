-- Prevent any signed-in app user from granting themselves
-- or removing platform-admin access through the browser/API.
-- Normal profile changes such as full_name and phone remain allowed.

create or replace function public.prevent_platform_admin_self_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and new.is_platform_admin is distinct from old.is_platform_admin then
    raise exception
      'Platform administrator access cannot be changed from the application.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_platform_admin_self_assignment
on public.profiles;

create trigger prevent_platform_admin_self_assignment
before update of is_platform_admin
on public.profiles
for each row
execute function public.prevent_platform_admin_self_assignment();