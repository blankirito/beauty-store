# Admin List Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make merchant-admin product, order, and customer lists truthful and usable before monkey testing.

**Architecture:** Keep list state in the existing client list components and move deterministic filtering, sorting, CSV construction, and retention calculations into small pure helpers. Server pages continue loading already-authorized store data; the UI only transforms that in-memory data. A shared server-loaded admin context replaces hardcoded identity data.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Supabase server client, browser Blob download.

**Spec:** `docs/superpowers/specs/2026-09-29-admin-workflow-reliability-design.md`

## Global Constraints

- Do not introduce Stripe, browser push, email, polling, or realtime subscriptions.
- Keep current visible status/category chips as the actual filters; remove duplicate inert filter controls.
- The existing list display limit remains display-only, not server pagination.
- CSV uses already-authorized in-memory admin orders only.
- Use the exact customer-facing copy: `Needs restocking` and `At or below its restock level`.

## Review Focus

- A record exactly 30 days old remains inside the Last 30 days range; add its boundary assertion in Task 2.
- CSV cells beginning with spreadsheet formula characters are neutralized and quotes/commas do not corrupt rows; add assertions in Task 2.
- A pending or cancelled order cannot make a customer returning; add this to Task 3.
- Sorting must not mutate the source data, otherwise another list control can unexpectedly change; add this to Task 1.
- A missing profile full name has a safe non-placeholder display name; add this mapping case in Task 4.

---

## File Structure

- `src/lib/admin/adminListControls.ts` — pure product/order/customer ordering, order date range, and CSV builder.
- `src/lib/admin/adminListControls.test.ts` — regression tests for all list transformations and CSV escaping.
- `src/components/admin/products/*` — product sort selector and removal of the redundant icon.
- `src/components/admin/orders/*` — order time/sort selectors, export action, and removal of the inert menu/icon.
- `src/components/admin/customers/*` — customer sort selector and removal of duplicate controls/icon.
- `src/lib/admin/adminCustomerReporting.ts` and test — paid-order count for retention.
- `src/lib/admin/getAdminStoreContext.ts` and test — authenticated member/store display context and pure mapper.
- `src/components/admin/shared/AdminStoreContext.tsx` — client context shared by the header and every repeated owner card.
- `src/app/admin/layout.tsx`, `AdminShell.tsx`, `AdminHeader.tsx`, `AdminOwnerCard.tsx` — pass real store/member context to shared chrome and cards.
- `ProductMetrics.tsx` and `ProductDetailClient.tsx` — unambiguous restock copy.

### Task 1: Create deterministic admin list-control helpers

**Files:**
- Create: `src/lib/admin/adminListControls.ts`
- Create: `src/lib/admin/adminListControls.test.ts`

**Interfaces:**
- Consumes: `AdminProduct`, `AdminOrder`, and `AdminReportingCustomer`.
- Produces: `sortAdminProducts(products, sort)`, `filterAndSortAdminOrders(orders, options)`, `sortAdminCustomers(customers, sort)`, and `buildAdminOrdersCsv(orders)`.

- [ ] **Step 1: Write failing tests for the four product sort modes and source-array immutability.**

- [ ] **Step 2: Run `npm test -- adminListControls` and verify it fails because the helper does not exist.**

- [ ] **Step 3: Implement `ProductSort` as `newest | oldest | name_asc | stock_asc` and `sortAdminProducts`.**

- [ ] **Step 4: Add failing tests for all-time/last-30-days order filtering, newest/oldest ordering, and an inclusive 30-day boundary using an injected `now: Date`.**

- [ ] **Step 5: Implement `filterAndSortAdminOrders(orders, { dateRange, sort, now })` without mutating `orders`.**

- [ ] **Step 6: Add failing tests for customer `highest_spent`, `most_recent`, and `oldest_customer` ordering.**

- [ ] **Step 7: Implement `CustomerSort` and `sortAdminCustomers`.**

- [ ] **Step 8: Add failing CSV tests for the exact header sequence, a quoted/comma-containing customer field, and formula-prefix neutralization.**

- [ ] **Step 9: Implement `buildAdminOrdersCsv` with columns: order number, date, customer name, customer email, fulfilment status, payment status, payment method, and total.** Use RFC-4180-style escaping and prefix a text cell beginning `=`, `+`, `-`, or `@` with a single quote.

- [ ] **Step 10: Run `npm test -- adminListControls`; expected: all helper tests pass.**

### Task 2: Wire product and order controls to one visible result set

**Files:**
- Modify: `src/components/admin/products/ProductsClient.tsx`
- Modify: `src/components/admin/products/ProductFilters.tsx`
- Modify: `src/components/admin/products/ProductsToolbar.tsx`
- Modify: `src/components/admin/orders/OrdersClient.tsx`
- Modify: `src/components/admin/orders/OrderStatusFilters.tsx`
- Modify: `src/components/admin/orders/OrdersToolbar.tsx`
- Modify: `src/components/admin/orders/OrdersHero.tsx`
- Modify: `src/components/admin/orders/OrderList.tsx`
- Modify: `src/app/admin/orders/page.tsx`

**Interfaces:**
- Consumes: Task 1 helpers.
- Produces: product/order controls whose counts, list, empty state, pagination text, and export all receive the same final result array.

- [ ] **Step 1: Add local product-sort state in `ProductsClient` with default `newest`; pass it through `ProductFilters` and render the sorted filtered array.**

- [ ] **Step 2: Replace the inert `Sort: Newest` display with an accessible selector offering Newest, Oldest, Name A–Z, and Stock low to high.**

- [ ] **Step 3: Remove the duplicate filter icon from `ProductsToolbar`; retain search, category, and status controls.**

- [ ] **Step 4: Add `all` / `last_30_days` and `newest` / `oldest` state to the orders workspace, apply Task 1 after its existing search/status/customer constraints, and pass final items to count/list/pagination.**

- [ ] **Step 5: Replace inert `Last 30 Days` and `Newest` buttons in `OrderStatusFilters` with accessible controls that expose All time, Last 30 days, Newest, and Oldest.**

- [ ] **Step 6: Remove the redundant orders-toolbar filter icon and remove the nonfunctional three-dot control from `OrderList`.**

- [ ] **Step 7: Place the export trigger inside the client orders workspace (or make the hero a client child) so it downloads a `text/csv;charset=utf-8` Blob generated from the current final array.** Name it `orders-YYYY-MM-DD.csv`; keep the established `Export Orders` copy.

- [ ] **Step 8: Run `npm test -- adminListControls` and manually verify product and order controls update the list count, list, and export consistently.**

### Task 3: Wire customer sorting and correct Customer Insights

**Files:**
- Modify: `src/components/admin/customers/CustomersClient.tsx`
- Modify: `src/components/admin/customers/CustomerFilters.tsx`
- Modify: `src/components/admin/customers/CustomersToolbar.tsx`
- Modify: `src/lib/admin/adminCustomerReporting.ts`
- Modify: `src/lib/admin/adminCustomerReporting.test.ts`

**Interfaces:**
- Consumes: `sortAdminCustomers` from Task 1.
- Produces: `AdminReportingCustomer.paidOrderCount` and retention based on that property.

- [ ] **Step 1: Add tests showing two pending orders and one paid plus one cancelled order do not produce a returning customer, while two paid orders do.**

- [ ] **Step 2: Add `paidOrderCount: number` to `AdminReportingCustomer`; increment it only for paid, non-cancelled customer orders. Update `getCustomerRetentionMetrics` to accept and use it.**

- [ ] **Step 3: Add customer-sort state with default `highest_spent`, then apply Task 1 after the existing search/status filters.**

- [ ] **Step 4: Replace the inert sort display with an accessible selector for Highest spent, Most recent, and Oldest customer. Remove the duplicate Tiers control and duplicate filter icon, retaining the existing status chips.**

- [ ] **Step 5: Run `npm test -- adminCustomerReporting adminListControls`; expected: all passing. Manually verify customer count, empty state, and pagination text use the sorted/filtered result.**

### Task 4: Replace placeholder identity and misleading stock language

**Files:**
- Create: `src/lib/admin/getAdminStoreContext.ts`
- Create: `src/lib/admin/getAdminStoreContext.test.ts`
- Create: `src/components/admin/shared/AdminStoreContext.tsx`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/admin/shared/AdminShell.tsx`
- Modify: `src/components/admin/shared/AdminHeader.tsx`
- Modify: `src/components/admin/shared/AdminOwnerCard.tsx`
- Modify: `src/components/admin/products/ProductMetrics.tsx`
- Modify: `src/components/admin/products/ProductDetailClient.tsx`

**Interfaces:**
- Produces: `AdminStoreContext { storeName: string; memberName: string; role: "owner" | "admin" }` for shell/header/owner card.

- [ ] **Step 1: Write mapping tests for an owner, an admin, and a blank profile name (fall back to `Account`, never a fake personal name or initials).**

- [ ] **Step 2: Implement pure `toAdminStoreContext` plus `getAdminStoreContext` using the existing authenticated server client and selected owner/admin membership; select the real store name and `profiles.full_name`.**

- [ ] **Step 3: Load the context after the existing access check in `AdminLayout`; have `AdminShell` provide it with `AdminStoreContext` so `AdminHeader` and every shared `AdminOwnerCard` consume the same value without adding props to every page.**

- [ ] **Step 4: Change `AdminOwnerCard` into a real `/admin/settings` link displaying store name, current member name, and Owner/Admin role. Remove tier, placeholder name, and placeholder initials.**

- [ ] **Step 5: Rename all current product-list/detail `Low Stock` copy to `Needs restocking`; use the explanatory copy `At or below its restock level` wherever a subtitle/help label exists. Keep threshold logic unchanged.**

- [ ] **Step 6: Run `npm test -- getAdminStoreContext adminProductMetrics` and `npm run build`; expected: pass. Manually verify owner/admin display on products, orders, and customers.**
