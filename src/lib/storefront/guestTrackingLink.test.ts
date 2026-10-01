import { describe, expect, it } from "vitest";
import { getGuestTrackingLink } from "./guestTrackingLink";

describe("guest tracking link", () => {
    it("creates the private store-scoped tracking URL", () => {
        expect(
            getGuestTrackingLink(
                "boutique-demo-store",
                "ORD-001000",
                "test-token",
            ),
        ).toBe(
            "/store/boutique-demo-store/orders/ORD-001000?token=test-token",
        );
    });

    it("encodes a tracking token safely", () => {
        expect(
            getGuestTrackingLink(
                "boutique-demo-store",
                "ORD-001000",
                "token with spaces",
            ),
        ).toBe(
            "/store/boutique-demo-store/orders/ORD-001000?token=token%20with%20spaces",
        );
    });
});