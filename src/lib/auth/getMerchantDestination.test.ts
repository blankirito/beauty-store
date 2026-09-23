import { describe, expect, it } from "vitest";
import { getMerchantDestination } from "./getMerchantDestination";

describe("merchant destination", () => {
  it("sends a new merchant to onboarding", () => {
    expect(
      getMerchantDestination({
        isPlatformAdmin: false,
        applicationStatus: null,
      }),
    ).toBe("/onboarding");
  });

  it("sends a submitted merchant to their admin portal", () => {
    expect(
      getMerchantDestination({
        isPlatformAdmin: false,
        applicationStatus: "pending_review",
      }),
    ).toBe("/admin");
  });

  it("keeps a suspended merchant inside their admin portal", () => {
    expect(
      getMerchantDestination({
        isPlatformAdmin: false,
        applicationStatus: "suspended",
      }),
    ).toBe("/admin");
  });

  it("sends a platform admin to platform management", () => {
    expect(
      getMerchantDestination({
        isPlatformAdmin: true,
        applicationStatus: null,
      }),
    ).toBe("/platform");
  });
});