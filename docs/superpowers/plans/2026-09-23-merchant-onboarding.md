# Merchant Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a merchant register, apply for one store, receive platform approval and a 14-day trial, while only eligible stores can sell publicly.

**Architecture:** Store applications and subscriptions are separate from `stores`. Security-definer RPCs create and transition applications; merchants cannot write approval states. Existing public storefront RPCs check the lifecycle status, `/admin` stays merchant-scoped, and `/platform` is platform-admin-only.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Supabase Auth/Postgres/RLS/RPC, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-23-merchant-onboarding-subscriptions-design.md`

## Global Constraints

- One email-verified merchant account owns one store in this release.
- Required application fields: name, slug, category, contact name, phone, description.
- Trial is 14 days. Standard price is RM59/month; the first ten approved merchants may use RM29/month for twelve months.
- Public routes and guest RPCs permit only `trialing` (unexpired) or `active` stores.
- Do not implement live Stripe, webhooks, annual plans, transaction fees, staff accounts, or multi-store ownership.
- Boutique Demo Store must remain public after migration.

## Review Focus

- A duplicate or reserved slug reports a field error and creates no second store (Task 2).
- A merchant cannot alter a request to make their application `active` (Task 1).
- A known pending/rejected/suspended public URL is unavailable for storefront, payment methods, checkout, and tracking (Task 4).
- A merchant cannot read or alter another merchant's application (Tasks 1 and 3).
- Boutique Demo Store stays eligible for all existing public flows (Tasks 1 and 4).

---

## File Structure

- `supabase/migrations/014_merchant_onboarding.sql`: lifecycle schema, RLS, secure actions, demo-store backfill.
- `supabase/migrations/015_public_store_eligibility.sql`: lifecycle checks in every public RPC.
- `supabase/queries/verify_merchant_onboarding.sql`: manual SQL verification.
- `src/lib/merchants/storeLifecycle.ts` and `.test.ts`: pure status/trial rules.
- `src/lib/merchants/storeApplication.ts` and `.test.ts`: slug/input validation.
- `src/components/register/RegisterForm.tsx`: real Supabase sign-up.
- `src/app/onboarding/*`, `src/components/onboarding/*`: draft and submitted application flow.
- `src/app/platform/*`, `src/components/platform/*`: platform review flow.
- `src/app/admin/billing/page.tsx`, `src/components/admin/billing/*`: truthful billing/trial UI.
- `src/app/admin/layout.tsx`, `src/lib/auth/getAdminAccessDestination.*`: application-aware merchant access.

### Task 1: Secure application lifecycle in Supabase

**Files:**
- Create: `supabase/migrations/014_merchant_onboarding.sql`
- Create: `supabase/queries/verify_merchant_onboarding.sql`

**Interfaces:**
- Consumes: `profiles`, `stores`, `store_members`, `public.is_platform_admin()` from `001_store_access.sql`.
- Produces: `store_application_status`, `store_applications`, `store_subscriptions`, `create_store_application`, `submit_store_application`, `review_store_application`, `is_public_store_eligible`.

- [ ] **Step 1: Write verification SQL first**

```sql
select stores.slug, applications.status, applications.trial_ends_at
from public.stores as stores
join public.store_applications as applications on applications.store_id = stores.id
where stores.slug = 'boutique-demo-store';

select policyname, cmd from pg_policies
where schemaname = 'public' and tablename = 'store_applications';
```

- [ ] **Step 2: Run the verification query before migration**

Run it in Supabase SQL Editor. Expected: `store_applications` is absent and the current demo store is visible for comparison.

- [ ] **Step 3: Add lifecycle tables and eligibility function**

```sql
create type public.store_application_status as enum (
  'draft', 'pending_review', 'trialing', 'active',
  'past_due', 'suspended', 'rejected'
);

create table public.store_applications (
  store_id uuid primary key references public.stores(id) on delete cascade,
  status public.store_application_status not null default 'draft',
  category text, contact_name text, contact_phone text, review_note text,
  submitted_at timestamptz, reviewed_at timestamptz,
  trial_started_at timestamptz, trial_ends_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.store_subscriptions (
  store_id uuid primary key references public.stores(id) on delete cascade,
  provider_customer_id text unique, provider_subscription_id text unique,
  plan_code text not null default 'lumina-monthly', status text not null default 'not_started',
  current_period_ends_at timestamptz, founding_price_locked_until timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
```

```sql
create or replace function public.is_public_store_eligible(p_store_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.store_applications
    where store_id = p_store_id
      and (status = 'active' or (status = 'trialing' and trial_ends_at > now()))
  );
$$;
```

- [ ] **Step 4: Add protected RPCs and RLS**

`create_store_application(name, slug, category, contact_name, phone, description)` must normalize `lower(btrim(slug))`, reject missing fields/taken slug, insert one store and a `draft` application atomically, and return `store_id`. `submit_store_application(store_id)` permits only its owner's `draft` or `rejected` store. `review_store_application(store_id, decision, note)` requires `is_platform_admin()`; `approve` sets `trialing`, `trial_started_at = now()`, and `trial_ends_at = now() + interval '14 days'`; `reject` requires a note; `suspend` permits only trialing/active/past_due rows.

Enable RLS. Owners may select only their application/subscription; they get no direct update policy on `store_applications`. Platform admins may read all and execute review RPCs.

- [ ] **Step 5: Backfill and verify**

```sql
insert into public.store_applications (store_id, status, trial_started_at)
select id, 'active', now() from public.stores
where slug = 'boutique-demo-store'
on conflict (store_id) do nothing;
```

Apply migration then run `verify_merchant_onboarding.sql`. Expected: demo store is `active`; no owner policy can update lifecycle fields.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/014_merchant_onboarding.sql supabase/queries/verify_merchant_onboarding.sql
git commit -m "feat: add merchant application lifecycle"
```

### Task 2: Test lifecycle and application input rules

**Files:**
- Create: `src/lib/merchants/storeLifecycle.ts`
- Create: `src/lib/merchants/storeLifecycle.test.ts`
- Create: `src/lib/merchants/storeApplication.ts`
- Create: `src/lib/merchants/storeApplication.test.ts`

**Interfaces:**
- Produces: `isPublicStoreEligible`, `getTrialDaysRemaining`, `canReviewApplication`, `normalizeStoreSlug`, `validateStoreApplicationInput`.

- [ ] **Step 1: Write failing tests**

```ts
expect(isPublicStoreEligible('trialing', new Date('2026-09-24T00:00:00Z'), new Date('2026-09-23T00:00:00Z'))).toBe(true);
expect(isPublicStoreEligible('trialing', new Date('2026-09-22T00:00:00Z'), new Date('2026-09-23T00:00:00Z'))).toBe(false);
expect(canReviewApplication('pending_review', 'approve')).toBe(true);
expect(canReviewApplication('active', 'suspend')).toBe(true);
expect(normalizeStoreSlug(' Aura Botanicals & Apothecary ')).toBe('aura-botanicals-apothecary');
expect(validateStoreApplicationInput({ name: 'Aura', slug: 'admin', category: 'Beauty', contactName: 'A', phone: '1', description: 'x' }).fieldErrors.slug).toBeDefined();
```

- [ ] **Step 2: Run tests to confirm they fail**

Run: `npm test -- storeLifecycle storeApplication`

Expected: FAIL because both modules are absent.

- [ ] **Step 3: Implement minimal pure helpers**

```ts
export type StoreApplicationStatus = 'draft' | 'pending_review' | 'trialing' | 'active' | 'past_due' | 'suspended' | 'rejected';

export function isPublicStoreEligible(status: StoreApplicationStatus, trialEndsAt: Date | null, now = new Date()) {
  return status === 'active' || (status === 'trialing' && trialEndsAt !== null && trialEndsAt > now);
}
```

Slug normalization creates lowercase hyphen-separated values, rejects `admin`, `platform`, `login`, `register`, `onboarding`, and `store`; descriptions are limited to 240 characters. Input errors return `{ fieldErrors: Record<string, string> }`.

- [ ] **Step 4: Run tests and commit**

Run: `npm test -- storeLifecycle storeApplication`

Expected: PASS.

```bash
git add src/lib/merchants
git commit -m "feat: validate merchant applications"
```

### Task 3: Implement merchant registration and onboarding

**Files:**
- Modify: `src/components/register/RegisterForm.tsx`
- Create: `src/app/onboarding/page.tsx`
- Create: `src/app/onboarding/actions.ts`
- Create: `src/components/onboarding/StoreApplicationForm.tsx`
- Create: `src/lib/auth/getMerchantDestination.ts`
- Create: `src/lib/auth/getMerchantDestination.test.ts`

**Interfaces:**
- Consumes: Task 1 RPCs and Task 2 validators.
- Produces: verified new merchants go to `/onboarding`; submitted applications become `pending_review`.

- [ ] **Step 1: Write the failing destination test**

```ts
expect(getMerchantDestination({ isPlatformAdmin: false, applicationStatus: null })).toBe('/onboarding');
expect(getMerchantDestination({ isPlatformAdmin: false, applicationStatus: 'pending_review' })).toBe('/admin');
expect(getMerchantDestination({ isPlatformAdmin: true, applicationStatus: null })).toBe('/platform');
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test -- getMerchantDestination`

Expected: FAIL because the helper is absent.

- [ ] **Step 3: Replace placeholder registration**

In `RegisterForm`, replace `window.setTimeout` with `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`. Keep password/terms validation. On no session, say that email verification is required; otherwise `router.replace('/onboarding')`. Remove phone from this account form because it belongs to the store application.

- [ ] **Step 4: Add protected onboarding form and server action**

Signed-out visitors redirect to `/login`. Form fields are exactly store name, URL slug, category, contact name, phone, description. Include the approved mobile step bar and `Save draft`/`Submit for review`; exclude concierge, custom domains, product samples, Apple Pay, and Stripe claims. The action validates first, calls the secure create RPC, then the submit RPC; duplicate-slug errors become a slug field error.

- [ ] **Step 5: Run tests and manual acceptance check**

Run: `npm test -- getMerchantDestination storeApplication`

Manual: sign up with a fresh email, verify it, save a draft, submit it, and confirm `/store/[slug]` remains unavailable.

- [ ] **Step 6: Commit**

```bash
git add src/components/register/RegisterForm.tsx src/app/onboarding src/components/onboarding src/lib/auth/getMerchantDestination.ts src/lib/auth/getMerchantDestination.test.ts
git commit -m "feat: add merchant onboarding"
```

### Task 4: Implement platform review and public eligibility

**Files:**
- Create: `src/app/platform/layout.tsx`
- Create: `src/app/platform/page.tsx`
- Create: `src/app/platform/store-applications/page.tsx`
- Create: `src/app/platform/store-applications/actions.ts`
- Create: `src/components/platform/StoreApplicationReview.tsx`
- Create: `supabase/migrations/015_public_store_eligibility.sql`
- Modify: `src/lib/storefront/getPublicStorefront.ts`
- Modify: `src/lib/storefront/publicStorefrontCache.ts`

**Interfaces:**
- Consumes: Task 1 review/eligibility RPCs.
- Produces: a platform-only review UI and lifecycle-secure public storefronts.

- [ ] **Step 1: Write public eligibility SQL checks**

```sql
select * from public.get_public_storefront('pending-store-slug');
select * from public.get_public_store_payment_methods('pending-store-slug');
```

Expected after migration: both return no rows. In a guest order attempt for the same slug, expect `Store not found.`

- [ ] **Step 2: Build the platform guard and review UI**

The `/platform` layout loads `profiles.is_platform_admin`; non-platform users redirect to `/admin` if they own a store, otherwise `/`. Use the approved single-column mobile design: pending list, selected application details, Approve, Request revisions/reject, and Suspend. Reject requires a note. Suspend is not shown for a pending row.

- [ ] **Step 3: Replace all public RPCs with eligibility-aware versions**

In `015_public_store_eligibility.sql`, add this predicate to `get_public_storefront`, `get_public_store_payment_methods`, and `get_guest_order_tracking`:

```sql
and public.is_public_store_eligible(stores.id)
```

In `create_guest_checkout_order`, select `v_store` only with this predicate so unavailable stores cannot create orders or decrement stock. Cache/product loaders return `null` when `get_public_storefront` returns null; `is_active` alone is never a public-access check.

- [ ] **Step 4: Verify authorization and public flows**

Manual: merchant opening `/platform` is redirected; platform admin approves a pending merchant; the store opens and can checkout; platform admin suspends it; storefront, payment methods, checkout, and tracking are all unavailable; Boutique Demo Store still works.

- [ ] **Step 5: Run all tests and commit**

Run: `npm test && npm run build`

Expected: PASS.

```bash
git add src/app/platform src/components/platform supabase/migrations/015_public_store_eligibility.sql src/lib/storefront
git commit -m "feat: review merchant applications and secure public stores"
```

### Task 5: Add truthful merchant Billing status

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/lib/auth/getAdminAccessDestination.ts`
- Modify: `src/lib/auth/getAdminAccessDestination.test.ts`
- Create: `src/app/admin/billing/page.tsx`
- Create: `src/components/admin/billing/BillingStatusCard.tsx`
- Modify: `src/components/admin/shared/AdminSidebar.tsx`

**Interfaces:**
- Consumes: Task 1 application/subscription state and Task 2 trial helper.
- Produces: application-aware Admin access and a non-deceptive Billing page.

- [ ] **Step 1: Write failing admin access tests**

```ts
expect(getAdminAccessDestination(true, false, true, 'draft')).toBe('/onboarding');
expect(getAdminAccessDestination(true, false, true, 'pending_review')).toBeNull();
expect(getAdminAccessDestination(true, false, true, 'suspended')).toBeNull();
expect(getAdminAccessDestination(false, false, false, null)).toBe('/login');
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test -- getAdminAccessDestination`

Expected: FAIL because the existing helper has only three parameters.

- [ ] **Step 3: Implement application-aware Admin layout**

Load the current owner's application status in `src/app/admin/layout.tsx`. Only a `draft` owner redirects to `/onboarding`; pending/trialing/active/suspended owners retain their private Admin. Platform admins must not accidentally receive merchant-store data.

- [ ] **Step 4: Build Billing UI from the mobile reference**

Show store name, lifecycle badge, trial days left, RM59/month, and a RM29 founding badge only when `founding_price_locked_until` exists. Add Billing & subscription navigation. The CTA reads `Billing will be available soon` and is disabled. Do not render live checkout, invoice history, Apple Pay, Stripe, tax, or transaction-fee claims.

- [ ] **Step 5: Run focused and final checks, then commit**

Run: `npm test -- getAdminAccessDestination storeLifecycle && npm run build`

Expected: PASS.

```bash
git add src/app/admin src/components/admin src/lib/auth/getAdminAccessDestination.ts src/lib/auth/getAdminAccessDestination.test.ts
git commit -m "feat: add merchant billing status"
```

## Final Acceptance

- [ ] Platform owner is marked once with `profiles.is_platform_admin = true`; no secrets are committed.
- [ ] Supabase Email confirmation redirects verified users to `/onboarding`.
- [ ] Both migrations (`014`, then `015`) are applied in Supabase SQL Editor.
- [ ] Fresh merchant: register → draft → submit → approve → 14-day public trial works.
- [ ] Merchant isolation and suspended-store public denial work with two merchant accounts.
- [ ] Boutique Demo Store's existing storefront, cart, checkout, and tracking continue to work.
- [ ] `npm test && npm run build` passes before push.
