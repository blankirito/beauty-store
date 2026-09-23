import { describe, expect, it } from "vitest";
import { canAccessOnboarding } from "./canAccessOnboarding";

describe("onboarding access", () => {
  it("allows a merchant applicant to start an application", () => {
    expect(
      canAccessOnboarding({
        hasMerchantIntent: true,
        hasOwnerMembership: false,
      }),
    ).toBe(true);
  });

  it("allows an existing store owner to edit an application", () => {
    expect(
      canAccessOnboarding({
        hasMerchantIntent: false,
        hasOwnerMembership: true,
      }),
    ).toBe(true);
  });

  it("blocks an ordinary customer", () => {
    expect(
      canAccessOnboarding({
        hasMerchantIntent: false,
        hasOwnerMembership: false,
      }),
    ).toBe(false);
  });
});