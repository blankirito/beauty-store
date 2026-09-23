# Customer and Merchant Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Separate customer registration from merchant onboarding while keeping one account able to do both.

**Architecture:** Store merchant_intent in Supabase Auth user metadata. It is routing preference only; existing platform-admin and store-membership checks remain authorization sources. Customer registration goes home; merchant registration records intent and goes to existing onboarding.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase Auth SSR, React, Tailwind CSS, Vitest, lucide-react.

**Spec:** docs/superpowers/specs/2026-09-23-customer-merchant-registration-design.md

## Global Constraints

- Preserve priority: platform owner, store admin, merchant applicant, customer.
- merchant_intent never grants store or platform permissions.
- Use the supplied Stitch reference only for /merchant/register.
- Keep /register customer-focused.
- The user edits code; the assistant reviews each result.
- Do not add a database migration.

## Review Focus

- Platform owners with store ownership still land on /platform.
- Merchant applicants without a store return to /onboarding after a later sign-in.
- Signed-out profile visitors selecting Start your store are sent to merchant registration.
- Signed-in customers selecting Start your store reach onboarding without management access.
- Ordinary customers manually opening /onboarding are redirected to /.

---

### Task 1: Add merchant intent to login routing

**Files:**
- Modify: src/lib/auth/getSignInDestination.ts
- Modify: src/lib/auth/getSignInDestination.test.ts
- Modify: src/components/login/LoginForm.tsx

**Interfaces:**
- Produces: getSignInDestination(isPlatformAdmin, hasStoreAdminAccess, hasMerchantIntent).

- [ ] **Step 1: Write the failing test**

Add to getSignInDestination.test.ts:

~~~ts
it("sends a merchant applicant without a store to onboarding", () => {
  expect(getSignInDestination(false, false, true)).toBe("/onboarding");
});
~~~

Change the platform test to call getSignInDestination(true, true, true), still expecting "/platform".

- [ ] **Step 2: Run the test to verify red**

Run:

~~~powershell
npm test -- getSignInDestination
~~~

Expected: the new assertion fails because the helper returns "/".

- [ ] **Step 3: Implement the smallest change**

~~~ts
export function getSignInDestination(
  isPlatformAdmin: boolean,
  hasStoreAdminAccess = false,
  hasMerchantIntent = false,
) {
  if (isPlatformAdmin) return "/platform";
  if (hasStoreAdminAccess) return "/admin";
  if (hasMerchantIntent) return "/onboarding";
  return "/";
}
~~~

- [ ] **Step 4: Pass real login data**

In LoginForm.tsx, pass this as third argument to getSignInDestination:

~~~ts
Boolean(signInData.user.user_metadata.merchant_intent)
~~~

- [ ] **Step 5: Verify green and commit**

Run npm test -- getSignInDestination. Expected: all destination tests pass.

~~~powershell
git add src/lib/auth/getSignInDestination.ts src/lib/auth/getSignInDestination.test.ts src/components/login/LoginForm.tsx
git commit -m "feat: route merchant applicants to onboarding"
~~~

### Task 2: Guard onboarding with a testable access rule

**Files:**
- Create: src/lib/merchants/canAccessOnboarding.ts
- Create: src/lib/merchants/canAccessOnboarding.test.ts
- Modify: src/app/onboarding/page.tsx
- Modify: src/app/onboarding/actions.ts

**Interfaces:**
- Produces: canAccessOnboarding({ hasMerchantIntent, hasOwnerMembership }): boolean.

- [ ] **Step 1: Write failing tests**

Create canAccessOnboarding.test.ts:

~~~ts
import { describe, expect, it } from "vitest";
import { canAccessOnboarding } from "./canAccessOnboarding";

describe("onboarding access", () => {
  it("allows a merchant applicant to start an application", () => {
    expect(canAccessOnboarding({
      hasMerchantIntent: true,
      hasOwnerMembership: false,
    })).toBe(true);
  });

  it("allows an existing store owner to edit an application", () => {
    expect(canAccessOnboarding({
      hasMerchantIntent: false,
      hasOwnerMembership: true,
    })).toBe(true);
  });

  it("blocks an ordinary customer", () => {
    expect(canAccessOnboarding({
      hasMerchantIntent: false,
      hasOwnerMembership: false,
    })).toBe(false);
  });
});
~~~

- [ ] **Step 2: Run it red**

Run npm test -- canAccessOnboarding. Expected: module-not-found failure.

- [ ] **Step 3: Add the pure rule**

~~~ts
type OnboardingAccessInput = {
  hasMerchantIntent: boolean;
  hasOwnerMembership: boolean;
};

export function canAccessOnboarding({
  hasMerchantIntent,
  hasOwnerMembership,
}: OnboardingAccessInput) {
  return hasMerchantIntent || hasOwnerMembership;
}
~~~

- [ ] **Step 4: Verify green**

Run npm test -- canAccessOnboarding. Expected: 3 tests pass.

- [ ] **Step 5: Use the rule on page and action**

In both onboarding files, import canAccessOnboarding. After the owner-membership query calculate:

~~~ts
const hasMerchantIntent = user.user_metadata.merchant_intent === true;
const hasOwnerMembership = Boolean(ownerMembership);
~~~

In page.tsx, redirect before rendering:

~~~ts
if (!canAccessOnboarding({ hasMerchantIntent, hasOwnerMembership })) {
  redirect("/");
}
~~~

In saveStoreApplication, return before selecting a mutation:

~~~ts
if (!canAccessOnboarding({ hasMerchantIntent, hasOwnerMembership })) {
  return {
    type: "error",
    error: "Start your merchant application before saving store details.",
  };
}
~~~

- [ ] **Step 6: Verify and commit**

Run npm test -- canAccessOnboarding storeApplicationMutation, then npm run build. Expected: both pass.

~~~powershell
git add src/lib/merchants/canAccessOnboarding.ts src/lib/merchants/canAccessOnboarding.test.ts src/app/onboarding/page.tsx src/app/onboarding/actions.ts
git commit -m "feat: protect merchant onboarding access"
~~~

### Task 3: Make existing registration customer-only

**Files:**
- Create: src/lib/auth/getSignUpDestination.ts
- Create: src/lib/auth/getSignUpDestination.test.ts
- Modify: src/components/register/RegisterForm.tsx
- Modify: src/app/register/page.tsx

**Interfaces:**
- Produces: getSignUpDestination(isMerchantRegistration): "/" | "/onboarding".

- [ ] **Step 1: Write a failing destination test**

~~~ts
import { describe, expect, it } from "vitest";
import { getSignUpDestination } from "./getSignUpDestination";

describe("sign-up destination", () => {
  it("sends a customer to the storefront home", () => {
    expect(getSignUpDestination(false)).toBe("/");
  });

  it("sends a merchant to onboarding", () => {
    expect(getSignUpDestination(true)).toBe("/onboarding");
  });
});
~~~

- [ ] **Step 2: Run it red**

Run npm test -- getSignUpDestination. Expected: module-not-found failure.

- [ ] **Step 3: Add the helper**

~~~ts
export function getSignUpDestination(isMerchantRegistration: boolean) {
  return isMerchantRegistration ? "/onboarding" : "/";
}
~~~

- [ ] **Step 4: Change customer registration**

In RegisterForm.tsx:

~~~ts
const destination = getSignUpDestination(false);
~~~

Use destination for both:

~~~ts
emailRedirectTo: window.location.origin + destination,
router.replace(destination);
~~~

Keep metadata to full_name and phone; do not set merchant_intent.

In app/register/page.tsx, add:

~~~tsx
<p className="mt-6 text-center text-sm text-on-surface-variant">
  Want to sell with Lumina?{" "}
  <Link href="/merchant/register" className="font-semibold text-primary hover:underline">
    Start your store
  </Link>
</p>
~~~

- [ ] **Step 5: Verify and commit**

Run npm test -- getSignUpDestination, then npm run build. Expected: both pass.

~~~powershell
git add src/lib/auth/getSignUpDestination.ts src/lib/auth/getSignUpDestination.test.ts src/components/register/RegisterForm.tsx src/app/register/page.tsx
git commit -m "feat: send customer registration to storefront"
~~~

### Task 4: Create the Stitch-based merchant route and profile entry

**Files:**
- Create: src/app/merchant/register/page.tsx
- Create: src/components/merchant/MerchantRegisterForm.tsx
- Modify: src/components/profile/ProfileMenu.tsx

**Interfaces:**
- Consumes: getSignUpDestination(true), Supabase signUp, and auth.updateUser.
- Produces: merchant registration recording merchant_intent and a profile entry to begin merchant onboarding.

- [ ] **Step 1: Create MerchantRegisterForm from the supplied Stitch reference**

Use a client component and the current RegisterForm state/validation pattern. Use the supplied copy and layout:

- SELL WITH LUMINA
- Build a boutique that feels like yours.
- stages: Apply, Curated review, Launch
- fields: founder name, business email, contact phone, password, confirmation
- footer link to /register

Its sign-up call must include the merchant intent:

~~~ts
const destination = getSignUpDestination(true);

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      phone,
      merchant_intent: true,
    },
    emailRedirectTo: window.location.origin + destination,
  },
});
~~~

When a session is returned, use router.replace(destination) and router.refresh(). When no session is returned, display:

~~~text
Check your email to confirm your merchant account, then continue setting up your store.
~~~

- [ ] **Step 2: Add the page route**

~~~tsx
import MerchantRegisterForm from "@/components/merchant/MerchantRegisterForm";

export default function MerchantRegisterPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto w-full max-w-md">
        <MerchantRegisterForm />
      </div>
    </main>
  );
}
~~~

- [ ] **Step 3: Add Start your store to ProfileMenu**

Add Store from lucide, useRouter, and createClient. Make Start your store render as a button with the same menu-card classes as the existing links. Its handler:

~~~ts
async function handleStartStore() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    router.push("/merchant/register");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    data: { merchant_intent: true },
  });

  if (!error) {
    router.replace("/onboarding");
    router.refresh();
  }
}
~~~

Keep other items as links.

- [ ] **Step 4: Manually verify all affected paths**

Run npm run dev and check:

1. New customer from /register reaches / after confirmation/sign-in.
2. New merchant from /merchant/register reaches /onboarding.
3. Merchant sign-out/sign-in before application submission returns to /onboarding.
4. Signed-in customer at /profile clicks Start your store and reaches /onboarding.
5. Ordinary customer opening /onboarding redirects to /.

- [ ] **Step 5: Run full verification and commit**

Run npm test, then npm run build. Expected: all pass and route output includes /merchant/register.

~~~powershell
git add src/app/merchant/register/page.tsx src/components/merchant/MerchantRegisterForm.tsx src/components/profile/ProfileMenu.tsx
git commit -m "feat: add merchant registration flow"
~~~

### Task 5: Release checkpoint

**Files:**
- Modify: the specification only if manual testing reveals an intentional behavior change.

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: verified customer and merchant registration journeys.

- [ ] **Step 1: Inspect final state**

~~~powershell
git status
git log --oneline -4
~~~

Expected: intended feature commits only and no unrelated staged files.

- [ ] **Step 2: Re-run regression checks**

Run npm test, then npm run build. Expected: both pass.

- [ ] **Step 3: Push the milestone**

~~~powershell
git push
~~~

Expected: the registration split is on the remote branch.

