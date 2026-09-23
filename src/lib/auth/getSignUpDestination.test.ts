import { describe, expect, it } from "vitest";
import { getSignUpDestination } from "./getSignUpDestination";

describe("sign-up destination", () => {
    it("sends a customer to the storefront home", () => {
        expect(getSignUpDestination(false)).toBe("/");
    });

    it("returns a customer to the store where they started registration", () => {
        expect(
            getSignUpDestination(false, "boutique-demo-store"),
        ).toBe("/store/boutique-demo-store");
    });

    it("sends a merchant to onboarding", () => {
        expect(getSignUpDestination(true)).toBe("/onboarding");
    });
});