# Storefront UI Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original Lumina customer UI across every `/store/[slug]` route while retaining live, store-scoped products, carts, accounts, and orders.

**Architecture:** Preserve original presentation components and Tailwind classes. Add store-aware adapter types and minimal storefront variants only where a current component imports mock global data or generates global URLs. Server pages continue to fetch and authorize data; client adapters receive serializable records and generate store-prefixed destinations.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS, Supabase, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-23-storefront-ui-restoration-design.md`

## Global Constraints

- The original components and their existing Tailwind classes are the visual source of truth.
- Do not introduce a second hard-coded storefront palette or page shell.
- All shopper links must remain within `/store/[slug]`.
- Orders must be scoped by both `store_id` and authenticated `customer_id`.
- Guest tracking must require its token; customer detail access must require order ownership.
- Run focused Vitest suites, then the full test suite and `npm run build` before completion.

## Review Focus

- A customer must never see another customer’s order by editing the URL.
- A cart from store A must never show a product from store B.
- A blank query must show the original Search discovery UI, not an empty results grid.
- Orders with multiple items must show the first product plus the correct additional-item count.
- A store logout must return the shopper to that same storefront.

---

### Task 1: Establish reusable storefront presentation data

**Files:**
- Create: `src/lib/storefront/storefrontOrderView.ts`
- Create: `src/lib/storefront/storefrontOrderView.test.ts`
- Modify: `src/lib/storefront/getCustomerStorefrontOrderTracking.ts`

- [ ] **Step 1: Write the failing mapping tests**

```ts
it("maps a fulfilled store order to the original customer card labels", () => {
  expect(toStorefrontOrderView({ fulfillmentStatus: "delivered" })).toMatchObject({
    status: "Completed",
    canTrack: false,
  });
});

it("normalizes an object or array shipping-address relation", () => {
  expect(getShippingAddress([{ recipient_name: "Ava" }])).toMatchObject({
    recipient_name: "Ava",
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- storefrontOrderView`

- [ ] **Step 3: Implement the minimal mapping helpers**

```ts
export function getShippingAddress<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}
```

Map fulfillment statuses through the existing `getStorefrontOrderStatus` function; expose product/item summary fields only.

- [ ] **Step 4: Use the normalizer in `getCustomerStorefrontOrderTracking`**

Select `payment_method_label` and `payment_method_instructions` and use them in the returned snapshot rather than replacing recorded payment content with generic text.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- storefrontOrderView storefrontOrders canViewStorefrontOrder`

### Task 2: Restore original Orders list UI with live storefront orders

**Files:**
- Create: `src/components/storefront/StorefrontOrdersClient.tsx`
- Create: `src/components/storefront/StorefrontOrderCard.tsx`
- Modify: `src/app/store/[slug]/orders/page.tsx`
- Test: `src/lib/storefront/storefrontOrderView.test.ts`

- [ ] **Step 1: Write a failing view-model test**

```ts
it("summarizes a multi-item order using its first item and remaining count", () => {
  expect(toStorefrontOrderView(order).itemSummary).toBe("1 item · +2 more");
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- storefrontOrderView`

- [ ] **Step 3: Query live display data server-side**

Select order number, date, fulfillment state, total, and item snapshot name/quantity/product ID. Build image URLs only from public store products and pass serialized order views into the client component.

- [ ] **Step 4: Recreate the original order components’ markup/classes**

`StorefrontOrdersClient` uses the same filter state and tabs as `OrdersClient`. `StorefrontOrderCard` copies the original `OrderCard` hierarchy and status styles, but links to `/store/${slug}/orders/${orderNumber}` and shows Track Order only for Shipping.

- [ ] **Step 5: Verify**

Run: `npm test -- storefrontOrderView storefrontOrders storefrontNavigation`

### Task 3: Restore original live order detail and tracking layouts

**Files:**
- Create: `src/components/storefront/StorefrontOrderDetail.tsx`
- Create: `src/components/storefront/StorefrontOrderTracking.tsx`
- Modify: `src/app/store/[slug]/orders/[orderNumber]/page.tsx`
- Test: `src/lib/storefront/storefrontOrderView.test.ts`

- [ ] **Step 1: Write failing timeline mapping tests**

```ts
it("marks the latest event as current and earlier events as completed", () => {
  expect(toOrderTimelineSteps(events).map((step) => step.status)).toEqual([
    "completed", "current",
  ]);
});
```

- [ ] **Step 2: Run test and confirm it fails**

Run: `npm test -- storefrontOrderView`

- [ ] **Step 3: Build detail and tracking adapters**

Pass real item snapshots, totals, address, payment label/instructions, and events to copies of the original detail/track layout classes. Use original `OrderDetailHeader`, timeline, order summary, shipping and payment visual patterns. Show a Track Order link for shipping orders and preserve token-protected guest access.

- [ ] **Step 4: Verify security and mappings**

Run: `npm test -- storefrontOrderView canViewStorefrontOrder guestOrderTracking`

### Task 4: Restore Home, Product, and Search presentation

**Files:**
- Create: `src/components/storefront/StorefrontNavbar.tsx`
- Create: `src/components/storefront/StorefrontProductDetail.tsx`
- Modify: `src/app/store/[slug]/page.tsx`
- Modify: `src/components/storefront/StorefrontProductCard.tsx`
- Modify: `src/components/storefront/StorefrontProductClient.tsx`
- Modify: `src/components/storefront/StorefrontSearchClient.tsx`
- Test: `src/lib/storefront/filterStorefrontProducts.test.ts`

- [ ] **Step 1: Add failing URL tests**

```ts
it("creates store-scoped product and search destinations", () => {
  expect(getStorefrontNavigation("boutique-demo-store").searchHref)
    .toBe("/store/boutique-demo-store/search");
});
```

- [ ] **Step 2: Verify the existing navigation test remains red only if behavior is absent**

Run: `npm test -- storefrontNavigation filterStorefrontProducts`

- [ ] **Step 3: Replace alternative storefront shells with original visual patterns**

Use a store-aware version of the original navbar. Reuse original home search/category/product-grid hierarchy, original product gallery/info/quantity/description/reviews/bottom-action hierarchy, and original search structure/classes. Feed real store products and scope every destination to the current slug.

- [ ] **Step 4: Verify**

Run: `npm test -- storefrontNavigation filterStorefrontProducts storefrontProduct`

### Task 5: Restore Profile and Cart presentation

**Files:**
- Create: `src/components/storefront/StorefrontProfileMenu.tsx` (replace simplified implementation)
- Create: `src/components/storefront/StorefrontCartLayout.tsx`
- Modify: `src/app/store/[slug]/profile/page.tsx`
- Modify: `src/components/storefront/StorefrontCartPage.tsx`
- Modify: `src/app/store/[slug]/cart/page.tsx`
- Test: `src/lib/storefront/storefrontProfile.test.ts`
- Test: `src/lib/storefront/storefrontCartView.test.ts`

- [ ] **Step 1: Write failing scoped-link and cart-isolation tests**

```ts
it("keeps the profile Orders action within the current store", () => {
  expect(getStorefrontNavigation("boutique-demo-store").ordersHref)
    .toBe("/store/boutique-demo-store/orders");
});
```

- [ ] **Step 2: Run tests to confirm the assertions cover desired behavior**

Run: `npm test -- storefrontProfile storefrontCartView storefrontNavigation`

- [ ] **Step 3: Preserve original layouts with live scoped data**

Use the original ProfileHeader, ProfileStats, ProfileMenu card styling and Logout placement. Replace only destinations with storefront URLs. Rebuild `StorefrontCartPage` around the original cart component layout/classes while retaining its real product lookup, quantity controls, store-scoped state, and checkout URL.

- [ ] **Step 4: Verify**

Run: `npm test -- storefrontProfile storefrontCart storefrontCartView getSignOutDestination`

### Task 6: Full verification and visual acceptance

**Files:**
- Modify: storefront files only as required by prior tasks.

- [ ] **Step 1: Run all automated tests**

Run: `npm test`

- [ ] **Step 2: Build production output**

Run: `npm run build`

- [ ] **Step 3: Manual acceptance flow**

Use one active store and a signed-in customer: open home, search a real product, open product detail, add to cart, open cart, create an order, open Orders, View Details, Track Order when shipped, open Profile, and sign out. Confirm every page retains original colours, spacing, typography, and actions while every URL remains under that store slug.

- [ ] **Step 4: Present changed files and verification results for user review**

Do not push. Commit only after the user has reviewed the complete storefront restoration.
