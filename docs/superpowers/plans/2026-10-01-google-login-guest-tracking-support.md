# Google Login and Guest Tracking Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let customers sign in with Google, preserve guest order access through a saveable private tracking link, and safely route password-help requests to WhatsApp support.

**Architecture:** Google OAuth stays within the existing Supabase SSR session model. A callback route exchanges the OAuth code, reads existing role/store access data, and reuses `getSignInDestination`. Pure helpers validate callback input, build guest tracking URLs, and normalize the public support number so these boundaries are unit-tested independently of browser APIs and external providers.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase Auth SSR, Google OAuth, Vitest, Vercel environment variables.

**Spec:** `docs/superpowers/specs/2026-10-01-google-login-guest-tracking-support-design.md`

## Global Constraints

- Keep all users, sessions, roles, and profiles in the existing Supabase Auth project.
- Never expose Google credentials, OAuth codes, tracking tokens, or the real WhatsApp number in repository files, test fixtures, documentation, or logs.
- Read the public support number only from `NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER`.
- Do not implement customer password reset email, SMTP, Resend, temporary passwords, or support-set passwords.
- Guest tracking continues to require the existing private token; do not add a lookup by order number, name, phone, or email.
- Validate OAuth continuation values as safe relative paths; reject absolute URLs and `//` protocol-relative values.

## Review Focus

- A malicious callback `next=https://attacker.example` or `next=//attacker.example` must never redirect off Lumina; test in Task 1.
- An invalid or absent support number must leave password login usable and show a safe support-unavailable state; test in Task 2.
- Store-specific Google login must retain only a normalized slug and return customers to that store; test in Task 1.
- Copying the guest URL must use the same private token URL as the Track action, without a new server endpoint; test in Task 3.
- A new Google user must receive the same role-aware destination rules as a password user; manually validate in Task 4.

---

## File Structure

- Create: `src/lib/auth/authCallback.ts` — validates a callback continuation/store value and returns a safe destination input.
- Create: `src/lib/auth/authCallback.test.ts` — tests safe callback path and store-slug handling.
- Create: `src/app/auth/callback/route.ts` — exchanges Supabase PKCE code and redirects through existing role-aware routing.
- Modify: `src/components/login/SocialLogin.tsx` — starts Google OAuth with the callback URL.
- Modify: `src/app/login/page.tsx` — passes the optional store slug to SocialLogin.
- Create: `src/lib/support/whatsAppSupport.ts` — normalizes a public WhatsApp number and builds a generic support URL.
- Create: `src/lib/support/whatsAppSupport.test.ts` — tests valid and invalid support configuration.
- Modify: `src/components/login/LoginForm.tsx` — replaces the placeholder Forgot Password action with safe WhatsApp support behavior.
- Create: `src/lib/storefront/guestTrackingLink.ts` — creates the canonical private guest tracking URL.
- Create: `src/lib/storefront/guestTrackingLink.test.ts` — verifies the canonical order/token URL.
- Modify: `src/components/storefront/StorefrontCheckoutPage.tsx` — reuses the canonical URL and adds client-side copy feedback.
- Create: `docs/operations/customer-sign-in-and-order-support.md` — operator-only support checklist without secrets.

### Task 1: Add safe Google OAuth callback flow

**Files:**
- Create: `src/lib/auth/authCallback.ts`
- Create: `src/lib/auth/authCallback.test.ts`
- Create: `src/app/auth/callback/route.ts`
- Modify: `src/components/login/SocialLogin.tsx`
- Modify: `src/app/login/page.tsx`

**Interfaces:**
- Produces: `getSafeAuthCallbackStoreSlug(value: string | null): string | undefined` and `getSafeAuthCallbackNext(value: string | null): string`.
- Consumes: `getSignInDestination(isPlatformAdmin, hasStoreMembership, hasMerchantIntent, storeSlug?)`.

- [ ] **Step 1: Write failing callback-safety tests**

Create `src/lib/auth/authCallback.test.ts`. Assert a valid `boutique-demo-store` slug is retained, whitespace/case normalize safely, invalid characters are rejected, `/store/boutique-demo-store` is accepted as a relative `next`, and `https://attacker.example`, `//attacker.example`, and `null` return `/`.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- authCallback`

Expected: FAIL because `./authCallback` does not exist.

- [ ] **Step 3: Implement safe callback helpers**

Create `src/lib/auth/authCallback.ts`. Allow only relative `next` values beginning with one `/` and reject protocol-relative values. Normalize store slugs to lowercase and accept only lowercase letters, digits, and internal hyphens; otherwise return `undefined`.

- [ ] **Step 4: Run focused helper tests**

Run: `npm test -- authCallback`

Expected: PASS.

- [ ] **Step 5: Create the OAuth callback route**

Create `src/app/auth/callback/route.ts`. Read `code`, `store`, and `next`; exchange a present code with `createClient().auth.exchangeCodeForSession(code)`. On success, query `profiles.is_platform_admin` and owner/admin `store_members` exactly as LoginForm does, then redirect using `getSignInDestination` and the safe store slug. On missing code, exchange failure, or missing profile, redirect to `/login?notice=google-sign-in-failed`; never include provider error details or code values.

- [ ] **Step 6: Wire the Google button**

Update `SocialLogin` to accept `storeSlug?: string`. Call `signInWithOAuth({ provider: "google", options: { redirectTo } })`, where `redirectTo` is `${window.location.origin}/auth/callback` with the normalized optional `store` query. Add loading and generic safe error states. Pass `store` from `src/app/login/page.tsx` into `SocialLogin`.

- [ ] **Step 7: Run focused tests and production build**

Run:

```powershell
npm test -- authCallback getSignInDestination
npm run build
```

Expected: all focused tests and the build pass; `/auth/callback` appears in the route list.

- [ ] **Step 8: Commit the Google OAuth code**

```powershell
git add src/lib/auth/authCallback.ts src/lib/auth/authCallback.test.ts src/app/auth/callback/route.ts src/components/login/SocialLogin.tsx src/app/login/page.tsx
git commit -m "feat: add Google sign-in callback"
```

### Task 2: Replace password-reset placeholder with safe WhatsApp support

**Files:**
- Create: `src/lib/support/whatsAppSupport.ts`
- Create: `src/lib/support/whatsAppSupport.test.ts`
- Modify: `src/components/login/LoginForm.tsx`

**Interfaces:**
- Produces: `getWhatsAppSupportHref(phoneNumber: string | undefined): string | null`.
- Consumes: `NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER` only in the Login component.

- [ ] **Step 1: Write failing WhatsApp support tests**

Create `src/lib/support/whatsAppSupport.test.ts`. Assert a valid international-number string produces a `https://wa.me/...` URL with a generic encoded sign-in-assistance message. Assert `undefined`, empty, or invalid characters return `null`, and no test includes the real support number.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- whatsAppSupport`

Expected: FAIL because `./whatsAppSupport` does not exist.

- [ ] **Step 3: Implement `getWhatsAppSupportHref`**

Create the helper with digits-only validation for a non-empty international number and a fixed generic support message. Return `null` rather than throwing for invalid configuration.

- [ ] **Step 4: Run focused helper tests**

Run: `npm test -- whatsAppSupport`

Expected: PASS.

- [ ] **Step 5: Update LoginForm support UI**

Replace the current Forgot Password placeholder click handler with a link when `getWhatsAppSupportHref(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER)` returns a URL. Use `target="_blank"` and `rel="noreferrer"`. When it returns `null`, keep the action non-destructive and show “Support is temporarily unavailable. Please try again later.” Remove obsolete reset-placeholder copy only; leave password sign-in unchanged.

- [ ] **Step 6: Run focused tests and production build**

Run:

```powershell
npm test -- whatsAppSupport
npm run build
```

Expected: PASS; Login builds without exposing the support number in static test data.

- [ ] **Step 7: Commit the WhatsApp support change**

```powershell
git add src/lib/support/whatsAppSupport.ts src/lib/support/whatsAppSupport.test.ts src/components/login/LoginForm.tsx
git commit -m "feat: add WhatsApp sign-in support"
```

### Task 3: Let guest customers copy their private tracking link

**Files:**
- Create: `src/lib/storefront/guestTrackingLink.ts`
- Create: `src/lib/storefront/guestTrackingLink.test.ts`
- Modify: `src/components/storefront/StorefrontCheckoutPage.tsx`

**Interfaces:**
- Produces: `getGuestTrackingLink(storeSlug: string, orderNumber: string, trackingToken: string): string`.
- Consumes: guest checkout success `storeSlug`, `order_number`, and `tracking_token`.

- [ ] **Step 1: Write the failing tracking-link test**

Create `src/lib/storefront/guestTrackingLink.test.ts`. Assert that known test values produce `/store/boutique-demo-store/orders/ORD-001000?token=test-token`; do not use any real token.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- guestTrackingLink`

Expected: FAIL because `./guestTrackingLink` does not exist.

- [ ] **Step 3: Implement canonical tracking-link construction**

Create `getGuestTrackingLink` in `src/lib/storefront/guestTrackingLink.ts`; encode the token with `encodeURIComponent` and use the existing store-scoped tracking path.

- [ ] **Step 4: Run focused helper tests**

Run: `npm test -- guestTrackingLink`

Expected: PASS.

- [ ] **Step 5: Update guest checkout success UI**

Replace the inline tracking URL construction in `StorefrontCheckoutPage` with the helper. Add a secondary `Copy tracking link` button that calls `navigator.clipboard.writeText` only on click and shows a temporary success message. Include concise copy explaining that the link is private and must be saved, while preserving the existing Track and Back to store actions.

- [ ] **Step 6: Run focused tests and production build**

Run:

```powershell
npm test -- guestTrackingLink guestCheckout guestOrderTracking
npm run build
```

Expected: PASS; the checkout success route compiles.

- [ ] **Step 7: Commit the guest tracking UI change**

```powershell
git add src/lib/storefront/guestTrackingLink.ts src/lib/storefront/guestTrackingLink.test.ts src/components/storefront/StorefrontCheckoutPage.tsx
git commit -m "feat: help guests save order tracking links"
```

### Task 4: Configure providers and verify real flows

**Files:**
- Create: `docs/operations/customer-sign-in-and-order-support.md`
- Modify: Vercel Production environment variables (dashboard only)
- Modify: Supabase Auth URL Configuration and Google provider settings (dashboard only)
- Modify: Google Cloud OAuth client settings (dashboard only)

**Interfaces:**
- Consumes: deployed `/auth/callback`, production Vercel root URL, Google OAuth Client ID/Secret, and the public WhatsApp support number.
- Produces: production Google sign-in and a documented operator process without a password reset-email promise.

- [ ] **Step 1: Write the operator support guide**

Create `docs/operations/customer-sign-in-and-order-support.md` with the six approved support rules from the spec: ask only account email/order number, verify only through protected dashboards, never request/view/set passwords, suggest Google only for the same email, never request guest tokens, and escalate identity/payment disputes without modifying ownership.

- [ ] **Step 2: Configure the Vercel support variable**

In Vercel Project Settings → Environment Variables, add `NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER` as a Production variable using the provided digits-only support number. Do not create a Git-tracked `.env` entry.

- [ ] **Step 3: Configure Supabase URL and Google provider**

In Supabase Auth URL Configuration, set Site URL to the production Vercel root URL and add `https://<production-host>/auth/callback` to Redirect URLs. In Supabase Auth Providers → Google, enable Google and enter the Google Client ID/Secret.

- [ ] **Step 4: Configure Google Cloud OAuth**

Create a Web application OAuth client. Add the production Vercel root URL as Authorized JavaScript origin and copy the Supabase Dashboard-provided callback URL exactly into Authorized redirect URIs. Do not use the Vercel `/auth/callback` URL as Google's provider redirect URI.

- [ ] **Step 5: Deploy and manually verify all user paths**

Deploy the production branch, then verify: generic Google customer login; store-specific Google login; merchant/platform Google login with existing access; invalid callback URL behavior; WhatsApp support link generic message; guest checkout copy/paste tracking in a private browser; and absence of any password request in the support guide.

- [ ] **Step 6: Run final automated checks**

Run:

```powershell
npm test
npm run build
```

Expected: every Vitest suite passes and the production build completes successfully.

- [ ] **Step 7: Commit documentation**

```powershell
git add docs/operations/customer-sign-in-and-order-support.md docs/superpowers/specs/2026-10-01-google-login-guest-tracking-support-design.md docs/superpowers/plans/2026-10-01-google-login-guest-tracking-support.md
git commit -m "docs: add customer sign-in support guide"
```

## Self-Review

- **Spec coverage:** Task 1 covers Google OAuth and safe routing; Task 2 covers WhatsApp support and absent configuration; Task 3 covers guest token-link saving; Task 4 covers external configuration, operator guidance, and full verification.
- **Step scan:** Every code task begins with a focused failing test and finishes with focused verification; external dashboard changes are grouped only with their exact live acceptance checks.
- **Type consistency:** SocialLogin passes a store slug to the callback; callback helpers return an optional safe store slug; `getSignInDestination` accepts that optional value. The WhatsApp and guest-link helpers each expose one explicit string-or-null/string interface.
- **Review focus:** Each listed risk is pinned to Task 1, 2, 3, or Task 4 manual validation.
- **Proportion:** The plan defines interfaces, boundaries, and provider configuration without reproducing existing UI or Supabase implementation bodies.
