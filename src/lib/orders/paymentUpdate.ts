export type PaymentConfirmationInput = {
    paymentStatus: string;
    fulfillmentStatus: string;
};

export function preparePaymentConfirmation(
    input: PaymentConfirmationInput,
) {
    if (input.fulfillmentStatus === "cancelled") {
        return {
            error: "Cancelled orders cannot be marked as paid.",
        };
    }

    if (input.paymentStatus !== "pending") {
        return {
            error: "This order has already been paid or cannot be confirmed.",
        };
    }

    return {
        data: {
            payment_status: "paid",
        },
        event: {
            title: "Payment confirmed",
            note: "Payment was confirmed by store staff.",
        },
    };
}