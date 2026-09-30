# Manual TNG Subscriptions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add manual TNG subscription applications, protected platform approval, expiry reconciliation, and quiet dashboard billing reminders.

**Architecture:** Store payment applications in Supabase and let database RPCs, not browser code, enforce membership and platform review. Approved requests update the existing subscription entitlement; the existing lifecycle job moves expired paid access through grace to suspension.

**Tech Stack:** Next.js App Router, TypeScript, Supabase RLS/RPC, Tailwind, Vitest.

**Spec:** docs/superpowers/specs/2026-09-30-manual-tng-subscriptions-design.md

## Global Constraints

- TNG only: no Stripe, card payment, bank transfer, screenshots, email, invoice, or automatic reconciliation.
- Complimentary access remains only for real free access.
- Only 1, 3, and 12 month durations are valid.
- Price, total, and extension dates are calculated server-side.
- Configure TNG_RECIPIENT_NAME and TNG_RECIPIENT_NUMBER as deployment variables; never commit actual values.
- Owners/admins submit/read own-store requests; only Platform Admin reviews.
- Hide routine active dashboard billing cards; show trial, payment-needed/grace, paused, and seven-or-fewer-days-to-expiry states.

## Review Focus

- Duplicate concurrent applications must leave one pending request.
- Renewing early must retain all prepaid days.
- Founding price is snapped at request time.
- Staff cannot access payment records.
- Expired active subscriptions enter the existing seven-day grace lifecycle.

## File Structure

- Create src/lib/merchants/manualSubscriptionPayment.ts and test: quote, valid-duration, form parsing, period extension, and dashboard-visibility rules.
- Create migration 041: request table, RLS, partial unique pending index, submit/review RPCs.
- Create migration 042: active-paid-period expiry reconciliation.
- Modify getMerchantBilling, BillingStatusCard, dashboard reminder, and their tests.
- Create admin/billing/actions.ts and ManualTngPaymentForm.tsx.
- Modify platform subscription page/actions and create PaymentRequestReviewForm.tsx.
- Modify README and supabase README with placeholder configuration and SQL verification instructions.

### Task 1: Payment rule helper

**Files:** Create src/lib/merchants/manualSubscriptionPayment.ts and .test.ts; modify merchantBilling.ts and test.

- [ ] Write failing tests: Standard three months totals RM177; valid founding price is RM29/month; duration two rejects; future end extends from its end; null/past end extends from now; only warning states get dashboard reminder.
- [ ] Run npm test -- manualSubscriptionPayment and confirm it fails because the module is absent.
- [ ] Implement MANUAL_PAYMENT_DURATIONS, getManualPaymentQuote, extendSubscriptionPeriod, prepareManualPaymentRequest, prepareManualPaymentReview, and shouldShowDashboardBillingReminder.
- [ ] Run npm test -- manualSubscriptionPayment merchantBilling subscriptionReminder; expect pass.
- [ ] Commit: feat: add manual subscription payment rules.

### Task 2: Database payment ledger

**Files:** Create supabase/migrations/041_manual_tng_subscription_requests.sql; modify supabase/README.md.

- [ ] Document manual SQL checks for owner/admin submit, staff denial, duplicate denial, non-platform review denial, rejection reason, and transactional approval.
- [ ] Create store_payment_requests with store/submitted-by IDs, plan/price/duration snapshots, payer/reference/note, pending/approved/rejected status, reviewer data, and timestamps.
- [ ] Add RLS plus a partial unique index for one pending row per store.
- [ ] Create submission RPC: membership check, trimmed required fields, duration validation, SQL price/total derivation, pending insert.
- [ ] Create review RPC: platform-admin check, required rejection reason, locking pending approval, later-of-expiry-or-now period extension, active application/subscription update, grace clear, and approved request in one transaction. Never set complimentary.
- [ ] Apply migration and execute the documented checks.
- [ ] Commit: feat: add manual payment request ledger.

### Task 3: Merchant payment request UI

**Files:** Modify getMerchantBilling.ts, BillingStatusCard.tsx, admin/billing/page.tsx; create admin/billing/actions.ts and ManualTngPaymentForm.tsx; modify README.md.

- [ ] Add failing preparation tests for trimmed payer/reference, optional note, invalid duration, and missing required fields.
- [ ] Query only the current store's latest/history requests and expose server-only TNG configuration or a safe missing-config state.
- [ ] Add submitManualTngPaymentRequest action using current owner/admin store selection, protected RPC, friendly errors, and revalidation.
- [ ] Implement TNG instructions, 1/3/12 selector, quote, payer/reference/note fields, pending state, rejection reason, and history. Keep complimentary merchants out of this flow.
- [ ] Replace disabled Checkout will be available soon control.
- [ ] Add README placeholders for local and Vercel TNG configuration.
- [ ] Run npm test -- manualSubscriptionPayment merchantBilling and manual-submit/duplicate tests.
- [ ] Commit: feat: let merchants submit TNG payment requests.

### Task 4: Platform approval UI

**Files:** Modify platform/subscriptions/page.tsx and actions.ts; create PaymentRequestReviewForm.tsx.

- [ ] Test approval/rejection parser: only 1/3/12 approve duration; rejection requires nonblank reason.
- [ ] Add Platform Admin review action invoking protected review RPC and revalidating platform, billing, admin, and storefront pages.
- [ ] Render pending queue with merchant, plan, amount, duration, payer/reference/note/time, expiry preview, approve selector, and reject reason.
- [ ] Keep payment review and complimentary controls separate.
- [ ] Run npm test -- manualSubscriptionPayment platformSubscriptions; manually prove admin can review and owner cannot.
- [ ] Commit: feat: review manual TNG subscription payments.

### Task 5: Lifecycle and dashboard

**Files:** Create supabase/migrations/042_reconcile_paid_subscription_expiry.sql; modify subscriptionReminder.ts/test, SubscriptionReminder.tsx, and admin/page.tsx.

- [ ] Write failing tests: far-future active returns null; near-expiry active warns; trial/past_due/suspended remain visible.
- [ ] Update reminder helper/component to hide only routine active access.
- [ ] Extend protected reconciliation: expired active period becomes past_due with seven-day grace; preserve trial and grace logic.
- [ ] Apply controlled lifecycle test: active to past_due to suspended, but future active remains active.
- [ ] Run npm test -- subscriptionReminder manualSubscriptionPayment merchantBilling.
- [ ] Commit: feat: reconcile manual subscription expiry.

### Task 6: Release verification

- [ ] Apply migration 041 then 042 to Supabase.
- [ ] Add TNG variables to .env.local and Vercel Production; never commit .env.local.
- [ ] Run npm test and npm run build; both must pass.
- [ ] Manually test standard/founding requests, duplicate prevention, rejection/resubmission, approval, early renewal, dashboard visibility, grace/suspension, complimentary isolation, and unauthorized actions.
- [ ] Commit only scoped verification fixes and push after all checks pass.
