import { describe, expect, it } from "vitest";
import { getSignInDestination } from "./getSignInDestination";

describe("getSignInDestination", () => {
    it("sends a platform admin to the admin dashboard", () => {
        expect(getSignInDestination(true)).toBe("/admin");
    });

    it("sends a store owner or admin to the admin dashboard", () => {
        expect(getSignInDestination(false, true)).toBe("/admin");
    });

    it("sends a customer to the storefront home page", () => {
        expect(getSignInDestination(false)).toBe("/");
    });
});