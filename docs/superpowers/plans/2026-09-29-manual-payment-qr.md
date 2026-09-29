# Manual Payment QR Codes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let merchant owners and admins upload one optional QR code for each manual payment method, visible to customers before and after checkout.

**Architecture:** Store an optional path on `store_payment_methods` and image objects in a dedicated public `payment-qr-codes` bucket. A server action validates ownership and files, then uses the server-only Supabase client to upload, replace, or remove QR images. The existing public payment method RPC returns the safe path for enabled methods; checkout builds a public URL only for the selected method.

**Tech Stack:** Next.js App Router, TypeScript, Supabase Postgres/Storage, Vitest, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-09-29-manual-payment-qr-design.md`

## Global Constraints

- One optional QR path per payment method: `qr_image_path`.
- Public bucket supports customer read access only; browser clients receive no write policies.
- Only JPEG, PNG, and WebP files up to 2 MB.
- Every mutation confirms the current user owns or administers the store.
- Manual payment orders stay pending until the existing merchant confirmation flow marks them paid.
- Do not add customer payment-proof uploads. Stripe remains a separate future workflow.

## Review Focus

- Bad replacement must retain the existing QR; Task 2.
- One store must never mutate another store's payment method; Task 3.
- No QR must render instructions only, without a blank image slot; Task 4.
- Disabled methods must not appear from the public RPC; Task 1.
- Failed old-object cleanup must not remove the new QR path; Task 3.

---

## File Structure

- `supabase/migrations/036_store_payment_method_qr_codes.sql`: column, public read-only bucket, and public RPC output.
- `src/lib/payments/paymentQrCode.ts`: validation, object path, and public URL helpers.
- `src/lib/payments/paymentQrCode.test.ts`: helper tests.
- `src/lib/payments/storePaymentMethod.ts`: merchant mapping.
- `src/lib/payments/getAdminStorePaymentMethods.ts`: merchant query selection.
- `src/app/admin/settings/payments/actions.ts`: secure QR save/replace/remove server action.
- `src/components/admin/settings/PaymentMethodEditor.tsx`: upload, preview, replace, remove controls.
- `src/lib/storefront/getPublicStorefront.ts`: public mapping.
- `src/components/storefront/StorefrontCheckoutPage.tsx`: checkout and success display.

### Task 1: Persist and expose QR paths

**Files:**
- Create: `supabase/migrations/036_store_payment_method_qr_codes.sql`
- Modify: `src/lib/payments/storePaymentMethod.ts`
- Modify: `src/lib/payments/getAdminStorePaymentMethods.ts`
- Modify: `src/lib/storefront/getPublicStorefront.ts`
- Test: `src/lib/payments/storePaymentMethod.test.ts`
- Test: `src/lib/storefront/getPublicStorefront.test.ts`

**Interfaces:** Produces `StorePaymentMethod.qrImagePath: string | null` and `StorefrontPaymentMethod.qrImagePath: string | null`. The public RPC returns `id`, `label`, `instructions`, and `qr_image_path` for enabled methods.

- [ ] Write failing mapping tests: a database path maps to `qrImagePath`; null remains null in both merchant and public types.
- [ ] Run `npm test -- storePaymentMethod getPublicStorefront`; expect failure because the property does not exist.
- [ ] Add migration 036: nullable `qr_image_path text`; public `payment-qr-codes` bucket with a 2 MB JPEG/PNG/WebP limit and no browser write policies; replace the public RPC to return the new field and restore `anon` / `authenticated` execute grants. Extend types and queries without changing order or enabled behavior.
- [ ] Run `npm test -- storePaymentMethod getPublicStorefront`; expect pass. Apply the migration in Supabase and verify the public RPC returns the QR field only for enabled methods.
- [ ] Commit with `feat: add payment method QR paths`.

### Task 2: Validate files and generate safe paths

**Files:**
- Create: `src/lib/payments/paymentQrCode.ts`
- Create: `src/lib/payments/paymentQrCode.test.ts`

**Interfaces:**
- `preparePaymentQrUpload({ name, type, size })` returns either `{ data: { extension: "jpg" | "png" | "webp" } }` or `{ error: string }`.
- `buildPaymentQrImagePath({ storeId, paymentMethodId, imageId, extension })` returns `stores/{storeId}/payment-methods/{paymentMethodId}/{imageId}.{extension}`.
- `getPublicPaymentQrUrl(supabaseUrl, storagePath)` returns the `payment-qr-codes` public URL.

- [ ] Write tests for JPEG/PNG/WebP, PDF and missing-MIME rejection, 2 MB boundary, exact path, and public URL.
- [ ] Run `npm test -- paymentQrCode`; expect missing module failure.
- [ ] Implement the three pure helpers. Normalize `image/jpeg` to `jpg`; validate only MIME and size, not QR content.
- [ ] Run `npm test -- paymentQrCode`; expect pass. Commit with `feat: validate payment QR uploads`.

### Task 3: Secure merchant QR mutation

**Files:**
- Modify: `src/app/admin/settings/payments/actions.ts`
- Modify: `src/components/admin/settings/PaymentMethodEditor.tsx`
- Test: `src/lib/payments/paymentQrCode.test.ts`

**Interfaces:** `updateStorePaymentMethod(formData: FormData)` accepts method id, label, instructions, enabled state, optional `qrImage`, and `removeQr`; returns the existing success/error shape.

- [ ] Add failing invalid-file and replacement-order tests. A rejected file creates no replacement path; old-file cleanup failure leaves the new database path intact.
- [ ] Run `npm test -- paymentQrCode storePaymentMethodUpdate`; expect failure.
- [ ] Refactor the action to authenticate and resolve the store as today, load the target method scoped to that store, validate/upload a unique QR with the server client, update `qr_image_path`, then clean old objects best-effort. For remove, clear the database path before best-effort deletion. Keep all label, instruction, enabled, ownership, and revalidation behavior.
- [ ] Add upload, preview, replace, and remove controls to the existing editor. Accept only the supported image types and send all fields through the existing Save changes interaction.
- [ ] Run `npm test -- paymentQrCode storePaymentMethod storePaymentMethodUpdate` and `npm run build`; expect pass. Manually prove a user outside the store cannot alter its QR. Commit with `feat: let merchants manage payment QR codes`.

### Task 4: Display selected QR at checkout and success

**Files:**
- Modify: `src/components/storefront/StorefrontCheckoutPage.tsx`
- Test: `src/lib/storefront/storefrontPaymentQr.test.ts`

**Interfaces:** Consumes `StorefrontPaymentMethod.qrImagePath` and `getPublicPaymentQrUrl`; renders QR guidance only for the currently selected method with a path.

- [ ] Write failing tests: path gives public URL plus the fixed customer guidance; null path gives no QR; changing selection changes the displayed source.
- [ ] Run `npm test -- storefrontPaymentQr`; expect failure.
- [ ] Render an accessible QR image, instructions, and guidance in the selected checkout method. In the success state render the same material for the method selected for that order. Never render an empty image slot and do not change pending-order creation.
- [ ] Run `npm test -- storefrontPaymentQr guestCheckout`, then the full test suite and production build; expect pass. Manually upload a TNG QR, check checkout and success, confirm the order stays pending until admin confirmation, then remove the QR and verify text-only payment still works. Commit with `feat: show payment QR codes at checkout`.

### Task 5: Final review and release verification

- [ ] Compare every section of the approved spec with code/tests: Goal, Data model, Merchant experience, Upload and authorization, Checkout and order flow, Failure handling, and Verification.
- [ ] Request code review focused on server-action authorization, Storage policies, path handling, old-file cleanup ordering, and checkout regressions.
- [ ] Run the full test suite and production build, then inspect Git status to confirm no secret or environment file is tracked.
