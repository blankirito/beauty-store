import { describe, expect, it } from "vitest";
import { prepareFulfillmentUpdate } from "./fulfillmentUpdate";

describe("fulfillment update preparation", () => {
    it("allows a new order to move to processing", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "new",
                nextStatus: "processing",
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

    it("rejects an invalid fulfillment transition", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "delivered",
                nextStatus: "processing",
            }),
        ).toEqual({
            error: "This order can no longer be moved to that status.",
        });
    });
    it("allows a shipped order to move to delivered", () => {
        expect(
            prepareFulfillmentUpdate({
                currentStatus: "shipped",
                nextStatus: "delivered",
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