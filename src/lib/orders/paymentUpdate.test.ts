import { describe, expect, it } from "vitest";
import { preparePaymentConfirmation } from "./paymentUpdate";

describe("payment confirmation preparation", () => {
    it("allows a pending order to be marked as paid", () => {
        expect(
            preparePaymentConfirmation({
                paymentStatus: "pending",
                fulfillmentStatus: "new",
            }),
        ).toEqual({
            data: {
                payment_status: "paid",
            },
            event: {
                title: "Payment confirmed",
                note: "Payment was confirmed by store staff.",
            },
        });
    });

    it("does not allow an already paid order to be confirmed again", () => {
        expect(
            preparePaymentConfirmation({
                paymentStatus: "paid",
                fulfillmentStatus: "new",
            }),
        ).toEqual({
            error: "This order has already been paid or cannot be confirmed.",
        });
    });

    it("does not allow a cancelled order to be marked as paid", () => {
        expect(
            preparePaymentConfirmation({
                paymentStatus: "pending",
                fulfillmentStatus: "cancelled",
            }),
        ).toEqual({
            error: "Cancelled orders cannot be marked as paid.",
        });
    });
});