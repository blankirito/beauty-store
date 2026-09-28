# Merchant Subscription and Platform Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every approved merchant a durable RM29 founding or RM59 standard entitlement, show that truthful status in merchant Billing and Dashboard UI, and give the platform owner a subscription overview.

**Architecture:** The database assigns the founding plan atomically while approving a store application. Server-only queries expose scoped billing data to a merchant or platform owner. Presentation components consume shaped view models and never calculate eligibility or accept a price from the browser.

**Tech Stack:** Next.js App Router, TypeScript, Supabase Postgres/RPC/RLS, Tailwind CSS, Vitest, lucide-react.

**Spec:** `docs/superpowers/specs/2026-09-28-merchant-subscription-platform-admin-design.md`

## Global Constraints

- Keep the 14-day trial card-free and do not introduce a live payment provider, payment keys, card fields, or fake checkout behavior.
- Standard plan is RM59/month; exactly the first ten approved merchants receive RM29/month for twelve months.
- Complimentary access is a platform-admin-only override with no automatic expiry; removing it returns the store to RM59 with a seven-day payment grace period.
- Assign founding eligibility inside the database approval transaction; never trust a client-provided price or browser redirect.
- Preserve merchant tenancy: merchants only see their own store; platform data stays platform-admin-only.
- Match the supplied Stitch Billing layout with real data; retain only substantiated product claims.
- User owns git commits and pushes; do not create a commit unless explicitly requested.

## Review Focus

- Concurrent approval at the ten-merchant boundary assigns at most ten founding plans; cover this with one SQL transaction/locking strategy and a focused database verification before production use.
- A merchant whose trial expires at the current time is not shown as publicly eligible or as having days remaining; test zero-day display and existing lifecycle eligibility.
- A founding price remains RM29 after another founding merchant cancels or is suspended; test stored plan, not a later count.
- A complimentary merchant sees no price or checkout action; after removal, the merchant sees RM59 and the exact payment grace date.
- An active merchant without a Stripe period end has no invented next-billing date; test the absent-date UI state.
- A non-platform merchant cannot request the platform subscription list; retain the existing platform access guard and exercise its redirect path manually.

---

### Task 1: Atomically assign the merchant plan at approval

**Files:**
- Create: `supabase/migrations/025_assign_founding_subscription_plan.sql`
- Modify: `src/lib/merchants/merchantBilling.ts`
- Modify: `src/lib/merchants/merchantBilling.test.ts`

**Interfaces:**
- Consumes: `public.review_store_application(p_store_id uuid, p_decision text, p_review_note text)` from migration `014_merchant_onboarding.sql`.
- Produces: `getMerchantBillingStatus(input: MerchantBillingInput, now?: Date): MerchantBillingStatus`, including `planCode`, `monthlyPrice`, and `foundingPriceLockedUntil`.
- Produces: subscription `plan_code` of `lumina-monthly-founding` or `lumina-monthly` at approval time.

- [ ] **Step 1: Write failing view-model tests for both plan prices**

```ts
expect(getMerchantBillingStatus({
  applicationStatus: "trialing",
  trialEndsAt: "2026-10-10T00:00:00.000Z",
  subscriptionStatus: "not_started",
  currentPeriodEndsAt: null,
  planCode: "lumina-monthly-founding",
  foundingPriceLockedUntil: "2027-10-03T00:00:00.000Z",
})).toMatchObject({ monthlyPrice: 29, planCode: "lumina-monthly-founding" });
```

Add the standard-plan assertion for RM59 and null lock expiry.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- merchantBilling`

Expected: FAIL because the current function does not accept or return plan data.

- [ ] **Step 3: Extend `MerchantBillingInput` and return type in `src/lib/merchants/merchantBilling.ts`**

Add `planCode: string` and `foundingPriceLockedUntil: string | null`. Map only `lumina-monthly-founding` to RM29; map every other existing plan code to RM59. Keep trial status precedence unchanged.

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npm test -- merchantBilling`

Expected: PASS.

- [ ] **Step 5: Create migration `025_assign_founding_subscription_plan.sql`**

Replace `public.review_store_application` with the same authorization and lifecycle behavior as migration 014. In its `approve` branch, lock the relevant subscription rows, count subscriptions whose `plan_code = 'lumina-monthly-founding'`, and update the approved store's subscription in the same transaction:

- count under 10: set `plan_code = 'lumina-monthly-founding'` and `founding_price_locked_until = now() + interval '12 months'`;
- otherwise: set `plan_code = 'lumina-monthly'` and lock expiry to null.

Keep the application update to `trialing`, `trial_started_at = now()`, and `trial_ends_at = now() + interval '14 days'` in the same function. Preserve reject and suspend behavior.

- [ ] **Step 6: Apply migration in the project Supabase environment and verify one approval manually**

Expected: an approved merchant receives a stored `plan_code`; re-opening the record never recalculates the price.

### Task 2: Return truthful merchant Billing data

**Files:**
- Modify: `src/lib/merchants/getMerchantBilling.ts`
- Modify: `src/app/admin/billing/page.tsx`
- Modify: `src/components/admin/billing/BillingStatusCard.tsx`
- Create: `src/components/admin/billing/BillingHistoryEmptyState.tsx`

**Interfaces:**
- Consumes: `getMerchantBillingStatus` from Task 1.
- Produces: `getMerchantBilling(): Promise<MerchantBilling | null>` with store name, plan, price, trial dates, lock date, and current period end.
- Produces: Billing UI that accepts `billing: MerchantBilling` and remains free of database access.

- [ ] **Step 1: Write the failing `getMerchantBillingStatus` test for displayed dates**

Assert a trial ending at `now` returns `trialDaysRemaining: 0` and exposes `trialEndsAt` for the UI. Assert an active standard-plan object with null `currentPeriodEndsAt` retains null rather than a fabricated date.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- merchantBilling`

Expected: FAIL because the current view model does not expose `trialEndsAt`.

- [ ] **Step 3: Extend `getMerchantBilling` selection and mapping**

Select `trial_started_at`, `trial_ends_at`, `plan_code`, and `founding_price_locked_until` from the existing nested application/subscription records. Return them through the Task 1 view model without relaxing membership authorization.

- [ ] **Step 4: Replace the single Billing card with Stitch-aligned composed UI**

In `BillingStatusCard`, render: merchant portal context, store name, state badge, trial alert, date-aware progress bar, verified plan card (RM29 or RM59), founding lock date when applicable, disabled future checkout button, and an honest security/help caption. Create `BillingHistoryEmptyState` for the zero-invoice section. Do not render Stitch's fixed `$49`, fake merchant ID, fake checkout animation, or unverified product benefits.

- [ ] **Step 5: Run tests and inspect the Billing page at mobile width**

Run: `npm test -- merchantBilling`

Expected: PASS. Confirm no price/date is hard-coded in the visible merchant data.

### Task 3: Add merchant subscription entry points

**Files:**
- Create: `src/components/admin/dashboard/SubscriptionReminder.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/components/admin/shared/AdminSidebar.tsx`
- Modify: `src/components/admin/shared/AdminBottomNav.tsx`

**Interfaces:**
- Consumes: `getMerchantBilling(): Promise<MerchantBilling | null>` from Task 2.
- Produces: `SubscriptionReminder({ billing: MerchantBilling | null })`.

- [ ] **Step 1: Write focused UI-state tests or pure helper tests for the reminder copy**

Create a pure exported helper if needed. Assert trial state mentions remaining days and Billing; assert past-due/suspended state uses recovery copy; assert null billing does not render misleading subscription data.

- [ ] **Step 2: Run the new targeted test to verify it fails**

Run: `npm test -- subscriptionReminder`

Expected: FAIL because no reminder/helper exists.

- [ ] **Step 3: Add `SubscriptionReminder` and load `getMerchantBilling` in `src/app/admin/page.tsx`**

Use `Promise.all` with existing dashboard queries. Place the compact card below `DashboardIntro`; it links to `/admin/billing`, shows only real status data, and makes no payment action.

- [ ] **Step 4: Add Billing to merchant navigation**

Add `CreditCard` Billing to `AdminSidebar`. Replace the mobile bottom-nav Analytics item with Billing to keep five equal mobile items, leaving Analytics reachable from the mobile sidebar drawer.

- [ ] **Step 5: Run the reminder test and visually verify mobile navigation**

Run: `npm test -- subscriptionReminder`

Expected: PASS. Confirm Billing is reachable on desktop and mobile and Analytics remains in the mobile drawer.

### Task 4: Add platform subscription health and list UI

**Files:**
- Create: `src/lib/platform/platformSubscriptions.ts`
- Create: `src/lib/platform/platformSubscriptions.test.ts`
- Create: `src/app/platform/subscriptions/page.tsx`
- Modify: `src/app/platform/page.tsx`

**Interfaces:**
- Consumes: authorized platform-user pattern from `src/app/platform/page.tsx` and subscription/application records.
- Produces: `getPlatformSubscriptionMetrics(records: PlatformSubscriptionRecord[]): PlatformSubscriptionMetrics`.
- Produces: `/platform/subscriptions`, guarded identically to `/platform`.

- [ ] **Step 1: Write failing metric tests**

```ts
expect(getPlatformSubscriptionMetrics([
  { applicationStatus: "trialing", planCode: "lumina-monthly-founding", subscriptionStatus: "not_started" },
  { applicationStatus: "trialing", planCode: "lumina-monthly", subscriptionStatus: "not_started" },
  { applicationStatus: "past_due", planCode: "lumina-monthly", subscriptionStatus: "past_due" },
])).toEqual({ trialing: 2, founding: 1, standard: 1, pastDue: 1, suspended: 0 });
```

Add a suspended case and confirm cancelled founding merchants retain the founding-plan count as stored data.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- platformSubscriptions`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement pure platform subscription metrics**

Create the function in `src/lib/platform/platformSubscriptions.ts`. Count lifecycle status separately from assigned plan so no revenue is invented and founding eligibility is not re-counted dynamically.

- [ ] **Step 4: Create the guarded subscription list page**

Copy the established authentication/`getPlatformAccessDestination` guard from `/platform`. Query store name, slug, application lifecycle/trial end, and subscription plan/lock/status. Render a mobile-first list with plan, state, relevant date, and empty state. Do not show payment or banking data.

- [ ] **Step 5: Replace Platform Overview's fake billing metric**

Query the same minimal records in `/platform`, replace `RM0.00 / Billing not connected yet` with the real counts and a link to `/platform/subscriptions`. Keep zero collected revenue unshown rather than fabricated.

- [ ] **Step 6: Run platform tests and perform authorization checks**

Run: `npm test -- platformSubscriptions`

Expected: PASS. Manually verify a platform administrator reaches `/platform/subscriptions`; a merchant is redirected away.

### Task 5: Full verification and user-owned push handoff

**Files:**
- Modify if needed: all files from Tasks 1–4 only.

**Interfaces:**
- Consumes: all prior deliverables.
- Produces: a tested UI/data-only subscription milestone without live payment integration.

- [ ] **Step 1: Run focused test suites**

Run: `npm test -- merchantBilling && npm test -- subscriptionReminder && npm test -- platformSubscriptions && npm test -- platformOverview && npm test -- storeLifecycle`

Expected: all selected suites PASS.

- [ ] **Step 2: Run production build locally**

Run: `npm run build`

Expected: Next.js finishes successfully and lists `/admin/billing` and `/platform/subscriptions` routes.

- [ ] **Step 3: Review the change list before user commit**

Run: `git status --short` and `git diff --check`

Expected: only subscription/platform files and documentation changed; no whitespace errors; no Stripe secret or generated artifacts.

- [ ] **Step 4: User reviews and pushes**

Tell the user exactly which tests/build passed and let them inspect, commit, and push. Stop after this UI/data milestone; do not begin Stripe integration until the user resumes after token refresh.
