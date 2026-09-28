-- Platform-only complimentary access for selected merchants.
-- Removing access returns the merchant to RM59 with a seven-day grace period.

alter table public.store_subscriptions
  add column if not exists complimentary_reason text,
  add column if not exists payment_grace_ends_at timestamptz;

-- A merchant in the payment grace period stays publicly accessible
-- until the seven-day deadline passes.
create or replace function public.is_public_store_eligible(
  p_store_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.store_applications application
    where application.store_id = p_store_id
      and (
        application.status = 'active'
        or (
          application.status = 'trialing'
          and application.trial_ends_at is not null
          and application.trial_ends_at > now()
        )
        or (
          application.status = 'past_due'
          and exists (
            select 1
            from public.store_subscriptions subscription
            where subscription.store_id = application.store_id
              and subscription.payment_grace_ends_at > now()
          )
        )
      )
  );
$$;

create or replace function public.set_store_complimentary_access(
  p_store_id uuid,
  p_decision text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Only platform administrators can manage complimentary access.';
  end if;

  if p_decision = 'grant' then
    update public.store_subscriptions
    set
      plan_code = 'lumina-monthly-complimentary',
      status = 'complimentary',
      complimentary_reason = nullif(btrim(coalesce(p_reason, '')), ''),
      payment_grace_ends_at = null,
      founding_price_locked_until = null,
      updated_at = now()
    where store_id = p_store_id;

    if not found then
      raise exception 'This store does not have a subscription record.';
    end if;

    update public.store_applications
    set
      status = 'active',
      updated_at = now()
    where store_id = p_store_id
      and status in ('trialing', 'active', 'past_due', 'suspended');

    if not found then
      raise exception 'This store cannot receive complimentary access.';
    end if;

  elsif p_decision = 'remove' then
    update public.store_subscriptions
    set
      plan_code = 'lumina-monthly',
      status = 'past_due',
      complimentary_reason = null,
      payment_grace_ends_at = now() + interval '7 days',
      founding_price_locked_until = null,
      updated_at = now()
    where store_id = p_store_id;

    if not found then
      raise exception 'This store does not have a subscription record.';
    end if;

    update public.store_applications
    set
      status = 'past_due',
      updated_at = now()
    where store_id = p_store_id
      and status in ('trialing', 'active', 'past_due', 'suspended');

    if not found then
      raise exception 'This store cannot have complimentary access removed.';
    end if;

  else
    raise exception 'Choose grant or remove.';
  end if;
end;
$$;

revoke all on function public.set_store_complimentary_access(uuid, text, text)
  from public;

grant execute on function public.set_store_complimentary_access(uuid, text, text)
  to authenticated;