-- Founding entitlement belongs to the first ten approved merchants.
-- Complimentary access must never erase that entitlement.

create or replace function public.review_store_application(
  p_store_id uuid,
  p_decision text,
  p_review_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_founding_plan_count integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Only platform administrators can review stores.';
  end if;

  if p_decision = 'approve' then
    perform pg_advisory_xact_lock(78245901);

    select count(*)::integer
    into v_founding_plan_count
    from public.store_subscriptions
    where founding_price_locked_until is not null;

    update public.store_applications
    set
      status = 'trialing',
      reviewed_at = now(),
      trial_started_at = now(),
      trial_ends_at = now() + interval '14 days',
      review_note = null,
      updated_at = now()
    where store_id = p_store_id
      and status = 'pending_review';

    if not found then
      raise exception 'This store cannot receive that review decision.';
    end if;

    update public.store_subscriptions
    set
      plan_code = case
        when v_founding_plan_count < 10
          then 'lumina-monthly-founding'
        else 'lumina-monthly'
      end,
      founding_price_locked_until = case
        when v_founding_plan_count < 10
          then now() + interval '12 months'
        else null
      end,
      updated_at = now()
    where store_id = p_store_id;

    if not found then
      raise exception 'This store does not have a subscription record.';
    end if;

  elsif p_decision = 'reject' then
    if nullif(btrim(coalesce(p_review_note, '')), '') is null then
      raise exception 'A rejection reason is required.';
    end if;

    update public.store_applications
    set
      status = 'rejected',
      reviewed_at = now(),
      review_note = btrim(p_review_note),
      updated_at = now()
    where store_id = p_store_id
      and status = 'pending_review';

  elsif p_decision = 'suspend' then
    update public.store_applications
    set
      status = 'suspended',
      reviewed_at = now(),
      review_note = nullif(btrim(coalesce(p_review_note, '')), ''),
      updated_at = now()
    where store_id = p_store_id
      and status in ('trialing', 'active', 'past_due');

  else
    raise exception 'Choose approve, reject, or suspend.';
  end if;

  if not found then
    raise exception 'This store cannot receive that review decision.';
  end if;
end;
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
declare
  v_founding_price_locked_until timestamptz;
begin
  if not public.is_platform_admin() then
    raise exception 'Only platform administrators can manage complimentary access.';
  end if;

  if p_decision = 'grant' then
    update public.store_applications
    set
      status = 'active',
      updated_at = now()
    where store_id = p_store_id
      and status in ('trialing', 'active', 'past_due');

    if not found then
      raise exception 'This store cannot receive complimentary access.';
    end if;

    update public.store_subscriptions
    set
      plan_code = 'lumina-monthly-complimentary',
      status = 'complimentary',
      complimentary_reason = nullif(btrim(coalesce(p_reason, '')), ''),
      payment_grace_ends_at = null,
      updated_at = now()
    where store_id = p_store_id;

    if not found then
      raise exception 'This store does not have a subscription record.';
    end if;

  elsif p_decision = 'remove' then
    select founding_price_locked_until
    into v_founding_price_locked_until
    from public.store_subscriptions
    where store_id = p_store_id
      and plan_code = 'lumina-monthly-complimentary'
    for update;

    if not found then
      raise exception 'This store does not have complimentary access.';
    end if;

    update public.store_subscriptions
    set
      plan_code = case
        when v_founding_price_locked_until is not null
          and v_founding_price_locked_until > now()
          then 'lumina-monthly-founding'
        else 'lumina-monthly'
      end,
      status = 'past_due',
      complimentary_reason = null,
      payment_grace_ends_at = now() + interval '7 days',
      updated_at = now()
    where store_id = p_store_id;

    update public.store_applications
    set
      status = 'past_due',
      updated_at = now()
    where store_id = p_store_id
      and status = 'active';

    if not found then
      raise exception 'This store cannot have complimentary access removed.';
    end if;

  else
    raise exception 'Choose grant or remove.';
  end if;
end;
$$;