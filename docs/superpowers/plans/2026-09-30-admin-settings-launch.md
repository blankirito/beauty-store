# Admin Settings Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship editable Store Profile, grouped Notification history, and accurate future-setting navigation for merchant administrators.

**Architecture:** The existing `stores` and `store_notifications` tables remain authoritative. Small pure helpers validate profile input and group notification data; protected Admin routes and server actions reuse the present membership and notification patterns.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Supabase SSR/Postgres, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-30-admin-settings-launch-design.md`

## Global Constraints

- The Settings menu contains exactly Store Profile, Payment Methods, Team & Permissions, Delivery & Shipping, and Notifications.
- Team & Permissions and Delivery & Shipping remain non-interactive “Coming soon” cards.
- Store Profile updates only the selected store's `name`, `slug`, and `description`; owner and admin roles may save it.
- Normalize slugs to lowercase; allow only lowercase letters, digits, and internal hyphens.
- Do not add team management, delivery rules, notification preferences, deletion, pagination, or old-slug redirects.
- Notifications are recipient-scoped: unread newest-first above read newest-first.
- Do not add dependencies. The user edits and runs commands; the assistant reviews each completed task.

## Review Focus

- Whitespace and uppercase in a slug normalize safely. Task 1.
- A duplicate slug returns a friendly error and leaves existing data unchanged. Task 2.
- An admin can update only their selected store, never an arbitrary store. Task 2 manual verification.
- A newer read item never appears above unread items. Task 3.
- A notification without an order marks read without invalid navigation. Task 4.

---

### Task 1: Profile validation and Settings navigation

**Files:**
- Create: `src/lib/admin/storeProfile.ts`
- Create: `src/lib/admin/storeProfile.test.ts`
- Modify: `src/lib/admin/adminSettingsNavigation.ts`
- Modify: `src/lib/admin/adminSettingsNavigation.test.ts`

**Interfaces:**
- Produces `prepareStoreProfileUpdate(input: StoreProfileUpdateInput): StoreProfileUpdate`.
- Input: `{ name: string; slug: string; description: string }`.
- Output: `{ name: string; slug: string; description: string | null }`.

- [ ] **Step 1: Write failing validation and navigation tests**

```ts
expect(prepareStoreProfileUpdate({
  name: "  Glow House  ",
  slug: " Glow-House ",
  description: "  Gentle skincare. ",
})).toEqual({
  name: "Glow House",
  slug: "glow-house",
  description: "Gentle skincare.",
});

expect(() => prepareStoreProfileUpdate({
  name: "",
  slug: "glow_house",
  description: "",
})).toThrow("Enter a valid store URL.");
```

Add cases for required name, edge hyphens, the 80-character slug limit, and 500-character description limit. Extend navigation tests to assert the exact five menu items and new available routes.

- [ ] **Step 2: Run the test to verify failure**

Run: `npm test -- storeProfile adminSettingsNavigation`

Expected: FAIL because the helper and routes are absent.

- [ ] **Step 3: Implement helper and navigation**

Trim name and description; normalize slug with `trim().toLowerCase()`. Require non-empty name up to 120 characters, slug matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`, and blank description stored as `null`. Set Store Profile to `/admin/settings/profile` and Notifications to `/admin/settings/notifications`; retain Team and Delivery as `coming_soon`.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- storeProfile adminSettingsNavigation`

Expected: PASS.

Commit only the four listed Task 1 files with message `feat: prepare admin store profile settings`.

### Task 2: Store Profile page and protected save action

**Files:**
- Create: `src/app/admin/settings/profile/page.tsx`
- Create: `src/app/admin/settings/profile/actions.ts`
- Create: `src/components/admin/settings/StoreProfileEditor.tsx`
- Create: `supabase/migrations/043_update_store_profile_rpc.sql`
- Modify: `src/components/admin/settings/StoreSettingsMenu.tsx`
- Modify: `src/lib/admin/storeProfile.ts`
- Modify: `src/lib/admin/storeProfile.test.ts`

**Interfaces:**
- Consumes `prepareStoreProfileUpdate` from Task 1.
- Produces `updateStoreProfile(input: StoreProfileUpdateInput): Promise<{ error?: string; data?: StoreProfileUpdate }>`.
- Page passes the selected store's `{ name, slug, description }` to `StoreProfileEditor`.

- [ ] **Step 1: Add a failing duplicate-slug mapping test**

Export a pure helper mapping Postgres code `23505` to `"That store URL is already in use."`; add its test. Do not mock Supabase or execute writes in Vitest.

- [ ] **Step 2: Run it to verify failure**

Run: `npm test -- storeProfile`

Expected: FAIL because the mapper is absent.

- [ ] **Step 3: Write and apply the protected profile RPC migration**

Create `043_update_store_profile_rpc.sql` with
`public.update_store_profile(uuid, text, text, text)`. It must verify
`auth.uid()` has the owner or admin role for the passed store, update only
`name`, `slug`, and `description`, use `security definer` with
`search_path = public`, revoke public/anon access, and grant execute only to
`authenticated`. Run it in Supabase SQL Editor before UI testing.

- [ ] **Step 4: Implement protected loading and saving**

Authenticate, obtain the selected store with the existing owner/admin `getAdminStoreId` membership pattern, validate input, and call `update_store_profile` with that store ID. Map duplicate slug conflict to the exact friendly error. Revalidate profile, settings, admin, and the new storefront path after success.

- [ ] **Step 5: Implement `StoreProfileEditor`**

Follow `PaymentMethodEditor` interaction conventions: controlled inputs, pending state, clear server error, refresh after success, and accessible labels. Display the URL prefix, warn that old links stop working after a slug change, and show the new saved URL.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- storeProfile adminSettingsNavigation`

Expected: PASS.

Run: `npm run build`

Expected: PASS with `/admin/settings/profile` listed.

Manually save name/description then slug; confirm new URL works, old URL does not redirect, invalid input is rejected, and duplicate slug does not change profile. Commit Task 2 files with message `feat: add merchant store profile settings`.

### Task 3: Notification grouping and full-history query

**Files:**
- Modify: `src/lib/admin/orderNotifications.ts`
- Modify: `src/lib/admin/orderNotifications.test.ts`
- Modify: `src/lib/admin/getAdminNotifications.ts`

**Interfaces:**
- Produces `groupAdminNotifications(notifications: AdminNotification[]): { unread: AdminNotification[]; read: AdminNotification[] }`.
- `getAdminNotifications(options?: { limit?: number })` defaults to the header's ten-row limit; `{ limit: undefined }` loads full history.

- [ ] **Step 1: Write a failing grouping test**

```ts
expect(groupAdminNotifications([readNewer, unreadOlder, unreadNewer, readOlder]))
  .toEqual({ unread: [unreadNewer, unreadOlder], read: [readNewer, readOlder] });
```

Use distinct timestamps to prove grouping and newest-first sorting; retain null-order conversion coverage.

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- orderNotifications`

Expected: FAIL because grouping is absent.

- [ ] **Step 3: Implement grouping and full-history query**

Use a non-mutating unread/read split and descending `createdAt` sort. Preserve the header's default ten records but permit Settings to request all records. Keep the current `recipient_user_id` filter unchanged.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- orderNotifications`

Expected: PASS.

Commit Task 3 files with message `feat: group complete admin notification history`.

### Task 4: Notifications page and safe navigation

**Files:**
- Create: `src/app/admin/settings/notifications/page.tsx`
- Create: `src/components/admin/settings/NotificationsHistory.tsx`
- Modify: `src/app/admin/notifications/actions.ts`
- Modify: `src/components/admin/shared/AdminHeader.tsx`
- Modify: `src/lib/admin/orderNotifications.ts`
- Modify: `src/lib/admin/orderNotifications.test.ts`

**Interfaces:**
- Consumes `getAdminNotifications({ limit: undefined })` and `groupAdminNotifications`.
- Produces `getAdminNotificationDestination(notification: Pick<AdminNotification, "orderNumber">): string | null`.
- `NotificationsHistory` receives `{ unread: AdminNotification[]; read: AdminNotification[] }`.

- [ ] **Step 1: Write a failing destination test**

Assert an order number maps to `/admin/orders/<orderNumber>` and `null` maps to `null`.

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- orderNotifications`

Expected: FAIL because destination helper is absent.

- [ ] **Step 3: Implement page and interactions**

Use the destination helper in header and page. Build a page with Settings return link, unread section first, read section second, time/order details, and an empty state. The client component marks unread items read in a transition; it navigates only when destination is non-null, otherwise refreshes in place. Disable repeat clicks while pending.

- [ ] **Step 4: Extend revalidation safely**

After marking read, revalidate `/admin/settings/notifications` as well as the existing Admin layout. Preserve authenticated recipient authority; a client-supplied recipient ID must not become authorization.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- orderNotifications adminSettingsNavigation storeProfile`

Expected: PASS.

Run: `npm run build`

Expected: PASS with `/admin/settings/notifications` listed.

Manually confirm unread is above a newer read notification; opening unread order notification marks it read and opens the order; no-order notification only marks read; another user cannot see the current user's history. Commit Task 4 files with message `feat: add admin notifications history`.

### Task 5: Settings release verification

**Files:**
- Modify: `README.md` only if it documents a prior Settings feature list.

**Interfaces:**
- Consumes all previous tasks; adds no runtime interface.

- [ ] **Step 1: Run focused Settings tests**

Run: `npm test -- storeProfile orderNotifications adminSettingsNavigation`

Expected: PASS.

- [ ] **Step 2: Run the complete suite and production build**

Run: `npm test`

Expected: PASS with no failed files.

Run: `npm run build`

Expected: PASS with both new Settings routes.

- [ ] **Step 3: Launch manual checklist and clean review**

Verify all five Settings cards, Store Profile save/slug change, Payment Methods regression, notification grouping/click behavior, non-interactive Team and Delivery cards, TNG submit/approval, ordinary-active dashboard reminder hidden, and public-store lifecycle.

Run `git status --short`, review every change, and let the user create their own commits and push only intended work.
