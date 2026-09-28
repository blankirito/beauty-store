# Operational Security and Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure checkout and platform privileges, make customer reporting reflect placed orders honestly, and complete automated merchant lifecycle operations without adding online payments.

**Architecture:** Database functions own all privileged state transitions: platform entitlement, payment confirmation, inventory release, and expiry reconciliation. Next.js server actions and a protected Vercel Cron route are thin authenticated callers. Reporting separates customer presence from paid revenue so a pending order is visible without inflating business metrics.

**Tech Stack:** Next.js App Router, TypeScript, Supabase PostgreSQL/RLS/RPC, Vitest, Vercel Cron.

**Spec:** `docs/superpowers/specs/2026-09-28-checkout-customer-security-design.md` and `docs/superpowers/specs/2026-09-28-platform-lifecycle-completion-design.md`

## Global Constraints

- Keep guest checkout; do not introduce card collection or a payment provider.
- Only verified received money may set `payment_status` to `paid`.
- Revenue, VIP, and paid analytics only include paid orders.
- Platform administrators are never self-assigned through the browser.
- All time-based transitions are idempotent and safe on repeated Cron calls.
- Never commit `CRON_SECRET`, Supabase service-role keys, or other environment secrets.

## Review Focus

- A regular authenticated user attempting to update `is_platform_admin` must be rejected by the database.
- Repeating a checkout submission must not create duplicate reservations or repeatedly reduce stock.
- Cancelling or expiring the same pending order twice must restore inventory only once.
- A pending-only customer appears in Customers but contributes RM0 to paid spend, revenue, and VIP decisions.
- A founding merchant who temporarily receives complimentary access retains their RM29 lock and no new founding slot is released.

---

### Task 1: Lock Platform Privileges and Correct Customer Reporting

**Files:**
- Create: `supabase/migrations/027_secure_profiles_and_customer_reporting.sql`
- Modify: `src/lib/admin/adminCustomerReporting.ts`
- Modify: `src/lib/admin/adminCustomerReporting.test.ts`
- Modify: `src/components/admin/customers/CustomerMetrics.tsx`
- Modify: `src/components/admin/customers/CustomerList.tsx`

**Interfaces:**
- Produces customer records with pending-order visibility and paid-only spending.
- Produces a database rule that rejects browser-authenticated changes to `profiles.is_platform_admin`.

- [ ] Write failing reporting tests for a pending-only customer, a mixed paid/pending customer, and a cancelled-only order.
- [ ] Run `npm test -- adminCustomerReporting` and verify the pending-customer expectation fails.
- [ ] Implement separate paid and pending aggregation fields; retain paid-only total spent, VIP, and revenue inputs.
- [ ] Update the Customer UI to show a distinct `Payment pending` label and accurate metric copy.
- [ ] Add the profile-protection migration and run it in Supabase SQL Editor.
- [ ] Run `npm test -- adminCustomerReporting` and verify it passes.

### Task 2: Safe Order Reservations, Manual Payment Confirmation, and Restocking

**Files:**
- Create: `supabase/migrations/028_order_reservations_and_payment_confirmation.sql`
- Modify: `supabase/migrations/006_order_fulfillment_actions.sql` through a replacement migration function
- Create: `src/lib/orders/orderPayment.ts`
- Create: `src/lib/orders/orderPayment.test.ts`
- Modify: `src/lib/orders/getAdminOrderDetail.ts`
- Modify: `src/lib/orders/adminOrderDetail.ts`
- Modify: `src/app/admin/orders/[id]/actions.ts`
- Modify: `src/components/admin/orders/OrderDetailClient.tsx`

**Interfaces:**
- Produces `confirm_order_payment(order_number, note)` for owner/admin/platform use.
- Produces idempotent inventory release for cancellation and expiry.

- [ ] Write failing tests for confirming pending payment once and preventing invalid repeat confirmation.
- [ ] Run `npm test -- orderPayment` and verify the missing payment-transition logic fails.
- [ ] Add reservation expiry and one-time inventory-release columns; update fulfilment cancellation to restore stock exactly once.
- [ ] Add the authenticated payment-confirmation RPC and append a payment event.
- [ ] Wire a `Mark as paid` action into the real admin order detail page, shown only while payment is pending.
- [ ] Run the focused tests and manually confirm a pending order appears, becomes paid only after the action, and gains its customer spend.

### Task 3: Secure Guest Checkout Entry and Scheduled Reconciliation

**Files:**
- Create: `src/app/api/cron/reconcile-lifecycle/route.ts`
- Create: `vercel.json`
- Create: `supabase/migrations/029_reconcile_order_and_subscription_lifecycle.sql`
- Modify: `src/components/storefront/StorefrontCheckoutPage.tsx`
- Create: `src/app/api/checkout/route.ts`
- Create: `src/lib/orders/lifecycleReconciliation.ts`
- Create: `src/lib/orders/lifecycleReconciliation.test.ts`

**Interfaces:**
- Produces `reconcile_operational_lifecycle()` to expire pending reservations, trials, and payment grace periods safely.
- Produces an internal checkout endpoint that applies duplicate-submission and abuse checks before invoking the protected order function.

- [ ] Write failing selector tests for expired reservations, expired trials, expired grace periods, and active exceptions.
- [ ] Run `npm test -- lifecycleReconciliation` and verify the tests fail before implementation.
- [ ] Implement the reconciliation database function and protected Cron route using `CRON_SECRET` bearer validation.
- [ ] Configure a daily Vercel Cron in `vercel.json` at `0 0 * * *` (08:00 Malaysia time).
- [ ] Move public checkout submission behind the server endpoint and revoke direct browser execution of the stock-changing function.
- [ ] Run focused tests, then configure `CRON_SECRET` in Vercel production settings and manually invoke the route once with the secret.

### Task 4: Finish Platform Lifecycle Controls and Entitlement Integrity

**Files:**
- Create: `supabase/migrations/030_preserve_founding_entitlements.sql`
- Modify: `src/lib/platform/complimentaryAccess.ts`
- Modify: `src/lib/platform/complimentaryAccess.test.ts`
- Modify: `src/lib/merchants/merchantBilling.ts`
- Modify: `src/lib/merchants/merchantBilling.test.ts`
- Modify: `src/app/platform/reviews/actions.ts`
- Modify: `src/app/platform/reviews/page.tsx`
- Modify: `src/app/platform/subscriptions/actions.ts`
- Modify: `src/app/platform/subscriptions/page.tsx`
- Modify: `src/app/platform/page.tsx`
- Modify: `src/components/admin/billing/BillingStatusCard.tsx`

**Interfaces:**
- Preserves `founding_price_locked_until` during complimentary access.
- Produces platform-only reject and suspend operations and complete subscription metrics.

- [ ] Write failing tests for founding access preserved through grant/remove and reject an invalid remove decision.
- [ ] Run `npm test -- complimentaryAccess merchantBilling` and verify these cases fail.
- [ ] Update the database functions so founding assignment uses immutable entitlement evidence and remove only affects complimentary subscriptions.
- [ ] Add reject-with-reason and suspend controls with server-side authorization checks.
- [ ] Show complimentary, payment-needed, and suspended counts on Platform overview; hide billing-history material for complimentary merchants.
- [ ] Run focused tests, `npm test`, and `npm run build`.

### Task 5: Production Verification and Release

**Files:**
- Modify: `docs/superpowers/specs/2026-09-28-checkout-customer-security-design.md` only if verification changes a confirmed rule.

- [ ] Run `npm test` and record the complete passing count.
- [ ] Run `npm run build` and confirm all routes compile.
- [ ] Manually verify: guest pending order, Customer visibility, Mark as paid, cancellation/restock, Platform reject/suspend, complimentary founder preservation, and Cron authentication.
- [ ] Inspect `git status --short`; stage only reviewed source, migrations, config, and docs; commit and push without force.
