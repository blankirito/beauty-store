# Customer Order Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Associate orders placed by signed-in customers with their accounts so they appear only in that customer's store-scoped order history and detail pages.

**Architecture:** Keep the browser checkout payload free of identity data. The server action derives the authenticated user from the request-bound Supabase client, passes the resulting ID or `null` to a service-role-only order RPC, and the RPC persists it atomically in `orders.customer_id`. Existing store-scoped RLS-backed reads, Admin order processing, guest orders, and private token tracking remain unchanged.

**Tech Stack:** Next.js App Router server actions, TypeScript, Supabase Auth/Postgres RPC, SQL migrations, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-30-customer-order-ownership-design.md`

## Global Constraints

- The browser must never send a customer ID; identity comes only from the server session.
- The order-creation RPC remains executable only by `service_role`.
- A signed-out checkout stores `NULL` for `orders.customer_id` and retains token tracking.
- Do not infer ownership for existing guest orders using email, phone, or name.
- Do not relax the existing store ID plus customer ID filters on customer order reads.

## Review Focus

- An authenticated user's ID must appear only as `p_customer_id` in the server-built RPC input; test this in Task 1.
- A signed-out checkout must pass `null`, not an empty string or browser-provided value; test this in Task 1.
- The new 13-argument RPC signature must revoke public roles and grant only `service_role`; inspect and run the migration in Task 2.
- Adding `customer_id` must not remove the tracking token from an authenticated customer's order; validate manually in Task 3.
- A customer from another account must still be unable to retrieve the order through the store-scoped history/detail pages; validate with a second account in Task 3.

---

## File Structure

- Create: `src/lib/storefront/checkoutOrderRpc.ts` — maps a validated checkout request and trusted optional customer ID into the exact RPC parameter object.
- Create: `src/lib/storefront/checkoutOrderRpc.test.ts` — unit coverage for authenticated and guest RPC inputs.
- Modify: `src/app/store/[slug]/checkout/actions.ts` — obtains the server session and sends the generated RPC parameters.
- Create: `supabase/migrations/045_link_authenticated_checkout_orders.sql` — replaces the old 12-parameter public and unchecked functions with 13-parameter server-only equivalents that persist `customer_id`.

### Task 1: Build trusted checkout RPC parameters

**Files:**
- Create: `src/lib/storefront/checkoutOrderRpc.ts`
- Create: `src/lib/storefront/checkoutOrderRpc.test.ts`
- Modify: `src/app/store/[slug]/checkout/actions.ts`

**Interfaces:**
- Consumes: `GuestCheckoutRequest` from `src/lib/storefront/guestCheckout.ts` and a server-derived `string | null` customer ID.
- Produces: `buildCheckoutOrderRpcParams(request: GuestCheckoutRequest, customerId: string | null)` with all current `create_guest_checkout_order` fields plus `p_customer_id: string | null`.

- [ ] **Step 1: Write the failing mapper tests**

Create `src/lib/storefront/checkoutOrderRpc.test.ts` with one authenticated test asserting that a validated checkout request produces the existing RPC fields and `p_customer_id: "customer-uuid"`, and one guest test asserting `p_customer_id: null`.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- checkoutOrderRpc`

Expected: FAIL because `./checkoutOrderRpc` does not exist.

- [ ] **Step 3: Implement the minimal RPC-parameter mapper**

Create `buildCheckoutOrderRpcParams(request: GuestCheckoutRequest, customerId: string | null)` in `src/lib/storefront/checkoutOrderRpc.ts`. Map existing request values to their current `p_*` names and add `p_customer_id: customerId`; do not accept raw form input or change `GuestCheckoutRequest`.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- checkoutOrderRpc`

Expected: PASS with both authenticated and guest cases.

- [ ] **Step 5: Update the server action to use the trusted identity**

In `src/app/store/[slug]/checkout/actions.ts`, import `createClient` from `@/lib/supabase/server` and `buildCheckoutOrderRpcParams`. After validating input, call `await createClient()` then `supabase.auth.getUser()`. Pass `user?.id ?? null` to the mapper and use its result in the service client's `create_guest_checkout_order` RPC call. Keep notification creation and all existing user-facing error messages unchanged.

- [ ] **Step 6: Run focused tests after action wiring**

Run: `npm test -- guestCheckout checkoutOrderRpc`

Expected: PASS; existing checkout validation remains unchanged and RPC parameter ownership cases pass.

- [ ] **Step 7: Commit the application change**

```powershell
git add src/lib/storefront/checkoutOrderRpc.ts src/lib/storefront/checkoutOrderRpc.test.ts src/app/store/[slug]/checkout/actions.ts
git commit -m "fix: link authenticated checkout orders to customers"
```

### Task 2: Persist the trusted customer ID in the checkout transaction

**Files:**
- Create: `supabase/migrations/045_link_authenticated_checkout_orders.sql`
- Reference: `supabase/migrations/011_guest_checkout.sql`
- Reference: `supabase/migrations/015_public_store_eligibility.sql`
- Reference: `supabase/migrations/030_restrict_guest_checkout_to_server.sql`

**Interfaces:**
- Consumes: The Task 1 RPC input, including `p_customer_id uuid`.
- Produces: `public.create_guest_checkout_order(..., p_customer_id uuid)` and `public.create_guest_checkout_order_unchecked(..., p_customer_id uuid)`, both with the same return table as the current functions.

- [ ] **Step 1: Record the migration acceptance checks before writing SQL**

In the SQL editor test plan, list these exact checks: authenticated checkout saves `orders.customer_id`; guest checkout leaves it `NULL`; the return remains `order_id`, `order_number`, `tracking_token`, `payment_method_label`, and `payment_instructions`; only `service_role` can execute the new public function signature.

- [ ] **Step 2: Create migration `045_link_authenticated_checkout_orders.sql`**

Drop the current 12-argument public wrapper before dropping its 12-argument unchecked dependency. Recreate the unchecked function with all existing transaction, stock-locking, payment validation, token, item, address, and event logic, adding `p_customer_id uuid` to its signature and `customer_id`/`p_customer_id` to the `orders` insert. Recreate the eligibility-checking public wrapper with the same additional parameter, forwarding it to the unchecked function. Retain `security definer`, `search_path`, and the current return table exactly.

- [ ] **Step 3: Restrict the new signature**

Revoke execute on the 13-argument public function from `public`, `anon`, and `authenticated`; grant it only to `service_role`. Revoke all access to the 13-argument unchecked function from those roles. Do not retain a callable 12-argument order-creation function.

- [ ] **Step 4: Apply the migration in Supabase SQL Editor**

Paste the complete migration into a new SQL Editor query and run it once. Confirm a successful result, then query `information_schema.routines` or `pg_proc` to verify the public function has the new parameter count and only one active order-creation entry point remains.

- [ ] **Step 5: Validate authorization and data shape**

Using a test order created by the application, query the order as an administrator and confirm `customer_id` is populated for an authenticated checkout. Place one signed-out test order and confirm its `customer_id` is null while `guest_access_token_hash` is populated.

- [ ] **Step 6: Commit the migration**

```powershell
git add supabase/migrations/045_link_authenticated_checkout_orders.sql
git commit -m "fix: persist authenticated checkout order ownership"
```

### Task 3: End-to-end regression verification

**Files:**
- Modify: none expected.

**Interfaces:**
- Consumes: Task 1 server action and Task 2 database functions.
- Produces: Verified customer-order ownership behaviour on the deployed app without widening read access.

- [ ] **Step 1: Run the focused automated tests**

Run: `npm test -- guestCheckout checkoutOrderRpc storefrontOrders guestOrderTracking`

Expected: PASS.

- [ ] **Step 2: Run the complete quality gate**

Run:

```powershell
npm test
npm run build
```

Expected: every Vitest suite passes and the Next.js production build completes successfully.

- [ ] **Step 3: Verify signed-in customer behaviour manually**

Sign in as Customer A, create a new order through `/store/[slug]/checkout`, then open `/store/[slug]/profile` and `/store/[slug]/orders`. Confirm the newly created order is visible, opens successfully, and its fulfillment events update after Admin processes it.

- [ ] **Step 4: Verify Admin and guest regressions manually**

Confirm the same signed-in customer order is visible and processable in Admin. In a private browser session, place a guest order and confirm its post-checkout token URL shows order tracking, while it does not become visible in Customer A's order list.

- [ ] **Step 5: Verify isolation manually**

Sign in as Customer B and open the same store's orders. Confirm Customer A's new order does not appear and direct detail navigation does not reveal it.

## Self-Review

- **Spec coverage:** Task 1 establishes a server-derived identity boundary; Task 2 persists it transactionally and retains guest behavior; Task 3 validates signed-in, guest, Admin, and cross-customer behavior. Historic-order matching and legacy static routes remain intentionally out of scope.
- **Step scan:** Each task has a focused test or acceptance loop and an independently reviewable deliverable.
- **Type consistency:** `buildCheckoutOrderRpcParams` accepts `GuestCheckoutRequest` plus `string | null`; the action produces exactly that trusted ID; the migration consumes `p_customer_id uuid`.
- **Review focus:** All five listed failure modes are assigned to Task 1, Task 2, or Task 3.
- **Proportion:** The plan defines interfaces and validation steps without reproducing the existing SQL function body.
