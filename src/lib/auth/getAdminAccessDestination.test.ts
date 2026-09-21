import { describe, expect, it } from "vitest";
import { getAdminAccessDestination } from "./getAdminAccessDestination";

describe("getAdminAccessDestination", () => {
    it("sends a signed-out visitor to login", () => {
        expect(getAdminAccessDestination(false, false)).toBe("/login");
    });

    it("allows a signed-in platform admin into the dashboard", () => {
        expect(getAdminAccessDestination(true, true)).toBeNull();
    });

    it("allows a signed-in store owner or admin into the dashboard", () => {
        expect(getAdminAccessDestination(true, false, true)).toBeNull();
    });

    it("sends a signed-in customer to the storefront home page", () => {
        expect(getAdminAccessDestination(true, false)).toBe("/");
    });
});