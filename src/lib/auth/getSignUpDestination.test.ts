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