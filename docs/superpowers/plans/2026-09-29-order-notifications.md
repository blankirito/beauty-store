# In-App Order Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Notify a store's owners and admins in the existing admin bell when a checkout creates an order.

**Architecture:** Store notifications as recipient-scoped records in Supabase. The successful checkout action creates records with the trusted service client but treats notification failure as non-fatal. The admin layout reads the signed-in recipient's recent notifications; a server action marks one read before the header refreshes.

**Tech Stack:** Next.js Server Actions, Supabase/Postgres RLS, TypeScript, Vitest, lucide-react.

**Spec:** `docs/superpowers/specs/2026-09-29-admin-workflow-reliability-design.md`

## Global Constraints

- Refresh-to-update only: no browser push, email, polling, or Supabase Realtime.
- A notification cannot bypass existing order-detail authorization.
- Checkout success must remain successful if notification creation fails; log the failure.
- Reads/state changes are constrained to their intended recipient and store.

## Review Focus

- An owner who is also an admin only receives one notification; test de-duplication in Task 1.
- A user cannot mark another recipient's notification read; test scoped update behavior in Task 2.
- An empty notification list has no misleading unread badge; test its header view model in Task 3.
- A notification failure after RPC checkout success returns the successful order; test the failure-isolation helper in Task 2.
- Deleted/missing order data still leaves safe notification text rather than a broken bell; test nullable order linkage in Task 1.

---

## File Structure

- `supabase/migrations/039_admin_order_notifications.sql` — notification table, indexes, and recipient-only RLS read policy.
- `src/lib/admin/orderNotifications.ts` — notification row/view mapping and recipient de-duplication.
- `src/lib/admin/orderNotifications.test.ts` — mapping, recipient, and unread-count tests.
- `src/lib/admin/getAdminNotifications.ts` — authenticated recent notification loader.
- `src/app/admin/notifications/actions.ts` — authenticated, recipient-scoped mark-read action using the service client after identity verification.
- `src/app/store/[slug]/checkout/actions.ts` — best-effort new-order notification write after successful order RPC.
- `src/app/admin/layout.tsx`, `AdminShell.tsx`, `AdminHeader.tsx` — load and render bell list.

### Task 1: Persist and model recipient-scoped notifications

**Files:**
- Create: `supabase/migrations/039_admin_order_notifications.sql`
- Create: `src/lib/admin/orderNotifications.ts`
- Create: `src/lib/admin/orderNotifications.test.ts`

**Interfaces:**
- Produces: `buildNewOrderNotifications({ storeId, orderId, orderNumber, recipients })` and `toAdminNotification(row)`.
- Database table: `store_notifications(id, store_id, recipient_user_id, order_id, title, body, read_at, created_at)`.

- [ ] **Step 1: Write failing tests that build one notification per unique owner/admin recipient, use the exact order number in title/body, and map unread/read state from `read_at`.**

- [ ] **Step 2: Run `npm test -- orderNotifications`; expected: fail because the module does not exist.**

- [ ] **Step 3: Implement the pure row builders and view mapper.** Use title `New order ${orderNumber}` and a body containing the customer/order context supplied by checkout.

- [ ] **Step 4: Create migration `039_admin_order_notifications.sql`.** Add foreign keys to stores/profiles/orders, an unread-recipient index, RLS enabled, and a SELECT policy limited to `recipient_user_id = auth.uid()`. Do not add browser-write policies; writes happen in server actions/service role only.

- [ ] **Step 5: Apply the migration in Supabase and run `npm test -- orderNotifications`; expected: pass.**

### Task 2: Create safely after checkout and mark safely as read

**Files:**
- Create: `src/lib/admin/getAdminNotifications.ts`
- Create: `src/app/admin/notifications/actions.ts`
- Modify: `src/app/store/[slug]/checkout/actions.ts`
- Test: `src/lib/admin/orderNotifications.test.ts`

**Interfaces:**
- Consumes: Task 1 builders.
- Produces: `getAdminNotifications(): Promise<AdminNotification[]>` and `markAdminNotificationRead(id: string): Promise<void>`.

- [ ] **Step 1: Add tests for recipient-scoped mark-read request construction and a checkout-notification failure that preserves the successful checkout result.**

- [ ] **Step 2: Implement `getAdminNotifications` with the current authenticated server client.** Resolve the user's permitted store membership, select only that recipient's newest records, and cap the header list at a small fixed amount (10).

- [ ] **Step 3: Implement `markAdminNotificationRead`.** Authenticate first, then use the trusted service client to set only `read_at` on the requested id constrained by `recipient_user_id = user.id`; revalidate the admin layout.

- [ ] **Step 4: After a successful `create_guest_checkout_order` RPC, resolve the request's store and owner/admin members, build rows, and insert them with the service client in a nested `try/catch`.** On failure call `console.error` with contextual safe metadata and return the original checkout success unchanged.

- [ ] **Step 5: Run `npm test -- orderNotifications guestCheckout`; expected: pass. Manually create one checkout and confirm checkout success remains even if notification insertion is deliberately unavailable in a local test environment.**

### Task 3: Render the admin bell notification experience

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/admin/shared/AdminShell.tsx`
- Modify: `src/components/admin/shared/AdminHeader.tsx`
- Test: `src/lib/admin/orderNotifications.test.ts`

**Interfaces:**
- Consumes: `AdminNotification[]` from Task 2 and `markAdminNotificationRead`.
- Produces: real unread count, recent list, and order link ` /admin/orders/[orderNumber] `.

- [ ] **Step 1: Add view-model tests for no unread indicator when all records are read and for a count matching unread records.**

- [ ] **Step 2: Fetch notifications in `AdminLayout` after its access guard and pass them into the client shell/header.**

- [ ] **Step 3: Replace the static bell dot with an accessible popover button: show the unread count only when positive, list newest ten notifications, show a useful empty state, and make each order notification an order link.**

- [ ] **Step 4: On opening/clicking a notification, call the mark-read server action and `router.refresh()`; navigation still goes through the existing order-detail authorization.**

- [ ] **Step 5: Run `npm test -- orderNotifications` and `npm run build`; expected: pass. Manual check: new checkout → refresh `/admin` → unread bell → click item → correct order opens and badge updates.**
