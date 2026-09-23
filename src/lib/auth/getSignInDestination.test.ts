import { describe, expect, it } from "vitest";
import { getSignInDestination } from "./getSignInDestination";

describe("getSignInDestination", () => {
  it("always sends a platform owner to platform management first", () => {
    expect(getSignInDestination(true)).toBe("/platform");
    expect(getSignInDestination(true, true, true)).toBe("/platform");
  });

  it("sends a store owner or admin to the admin dashboard", () => {
    expect(getSignInDestination(false, true)).toBe("/admin");
  });

  it("sends a merchant applicant without a store to onboarding", () => {
    expect(getSignInDestination(false, false, true)).toBe("/onboarding");
  });

  it("sends a customer to the storefront home page", () => {
    expect(getSignInDestination(false)).toBe("/");
  });
});