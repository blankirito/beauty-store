# Storefront New Arrivals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn New Arrivals into a real per-store catalogue experience: four newest products on home and up to 24 on a store-specific page.

**Architecture:** Extend the existing public storefront product mapping with creation time and keep the existing public-store eligibility/cache paths. A small pure selector limits the already newest-first active product list. Both home and the new route reuse the established header and product-card components.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Supabase public data path, existing storefront components.

**Spec:** `docs/superpowers/specs/2026-09-29-admin-workflow-reliability-design.md`

## Global Constraints

- Use active products from the current public store only, actual `created_at` descending.
- Home shows exactly up to four products; View all route is `/store/[slug]/collection/new-arrivals` and shows up to 24.
- Preserve existing public store eligibility rules and wishlist behavior.
- Do not use `src/data/products` or the old global static collection page for this entry point.

## Review Focus

- A store with fewer than four products shows all available products without blank cards; test in Task 1.
- An inactive product never appears even if it has the newest date; retain/verify existing query constraints in Task 2.
- Two products with equal timestamps preserve their data-source order; test stable limiting in Task 1.
- An unavailable/non-public store returns the existing not-found behavior; test/load through the same cached storefront guard in Task 2.
- The View all link remains store-slug scoped and cannot lead to the global static data route; test route construction in Task 2.

---

## File Structure

- `src/lib/storefront/storefrontProduct.ts` and test — carry `created_at` through the existing mapping.
- `src/lib/storefront/selectNewArrivals.ts` and test — pure four/24 selector.
- `src/lib/storefront/getPublicStorefront.ts`, `publicStorefrontCache.ts`, cart, and checkout product queries — select `created_at` with current active/newest query.
- `src/app/store/[slug]/page.tsx` — four-card New Arrivals home section and store-specific View all link.
- `src/app/store/[slug]/collection/new-arrivals/page.tsx` — public, store-scoped collection page reusing header/cards.

### Task 1: Model and select real newest products

**Files:**
- Modify: `src/lib/storefront/storefrontProduct.ts`
- Modify: `src/lib/storefront/storefrontProduct.test.ts`
- Create: `src/lib/storefront/selectNewArrivals.ts`
- Create: `src/lib/storefront/selectNewArrivals.test.ts`

**Interfaces:**
- Produces: `StorefrontProduct.createdAt: string` and `selectNewArrivals(products, limit): StorefrontProduct[]`.

- [ ] **Step 1: Add a failing mapper test asserting a database `created_at` becomes `createdAt`. Update existing fixtures with the new required field.**

- [ ] **Step 2: Implement the mapping field in `DatabaseStorefrontProduct` and `StorefrontProduct`.**

- [ ] **Step 3: Add failing selector tests for a four-product home cap, 24-product page cap, fewer-than-limit products, and unchanged order for equal timestamps.**

- [ ] **Step 4: Implement `selectNewArrivals(products, limit)` as a non-mutating slice; data loaders already provide newest-first order.**

- [ ] **Step 5: Run `npm test -- storefrontProduct selectNewArrivals`; expected: pass.**

### Task 2: Use the current store's public catalogue in home and View all

**Files:**
- Modify: `src/lib/storefront/getPublicStorefront.ts`
- Modify: `src/lib/storefront/publicStorefrontCache.ts`
- Modify: `src/app/store/[slug]/page.tsx`
- Create: `src/app/store/[slug]/collection/new-arrivals/page.tsx`
- Test: `src/lib/storefront/selectNewArrivals.test.ts`

**Interfaces:**
- Consumes: Task 1 `selectNewArrivals` and existing `getCachedPublicStorefront*` calls.
- Produces: home New Arrivals section and `getStorefrontNavigation(slug)` extension `newArrivalsHref` if a shared route helper is needed.

- [ ] **Step 1: Add `created_at` to every query whose row is converted by `toStorefrontProduct` (direct and cached list/detail queries plus cart/checkout lookups).** Retain `.eq("is_active", true)` and descending created-at ordering for catalogue lists.

- [ ] **Step 2: Extend the storefront navigation helper with the exact slug-scoped New Arrivals href and add/update its unit test.**

- [ ] **Step 3: On `src/app/store/[slug]/page.tsx`, replace the inert New Arrivals label/entry with a real section that renders `selectNewArrivals(products, 4)` using existing product cards and preserved wishlist initial ids.** Include a `View all` link to the slug-scoped route. Keep the all-product section as the existing separate browsing area.

- [ ] **Step 4: Create the new collection route.** Resolve `getCachedPublicStorefront(slug)` and call `notFound()` if unavailable; load cached active products; select 24; render `StorefrontHeader`, title/description, empty state, and existing cards with wishlist ids. Do not import `src/data/products`.

- [ ] **Step 5: Run `npm test -- storefrontProduct selectNewArrivals storefrontNavigation` and `npm run build`; expected: pass.**

- [ ] **Step 6: Manually verify a store with five-plus products: home shows the four newest, View all shows newest-first up to 24, and the old `/collection/new-arrivals` path is not linked from store home.**
