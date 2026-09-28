import { describe, expect, it } from "vitest";
import { prepareFulfillmentUpdate } from "./fulfillmentUpdate";

describe("fulfillment update preparation", () => {
    it("allows a paid new order to move to processing", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "new",
                nextStatus: "processing",
                paymentStatus: "paid",
            }),
        ).toEqual({
            data: {
                fulfillment_status: "processing",
            },
            event: {
                fulfillmentStatus: "processing",
                title: "Order is being processed",
            },
        });
    });

    it("does not allow a pending order to move to processing", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "new",
                nextStatus: "processing",
                paymentStatus: "pending",
            }),
        ).toEqual({
            error: "Confirm payment before processing this order.",
        });
    });

    it("allows a pending new order to be cancelled", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "new",
                nextStatus: "cancelled",
                paymentStatus: "pending",
            }),
        ).toEqual({
            data: {
                fulfillment_status: "cancelled",
            },
            event: {
                fulfillmentStatus: "cancelled",
                title: "Order has been cancelled",
            },
        });
    });

    it("rejects an invalid fulfillment transition", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "delivered",
                nextStatus: "processing",
                paymentStatus: "paid",
            }),
        ).toEqual({
            error: "This order can no longer be moved to that status.",
        });
    });

    it("allows a paid shipped order to move to delivered", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "shipped",
                nextStatus: "delivered",
                paymentStatus: "paid",
            }),
        ).toEqual({
            data: {
                fulfillment_status: "delivered",
            },
            event: {
                fulfillmentStatus: "delivered",
                title: "Order has been delivered",
            },
        });
    });
});