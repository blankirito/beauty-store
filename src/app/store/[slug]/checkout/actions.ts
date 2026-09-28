"use server";

import { createServiceClient } from "@/lib/supabase/service";
import {
    prepareGuestCheckoutRequest,
    type GuestCheckoutRequest,
} from "@/lib/storefront/guestCheckout";

type CheckoutSuccess = {
    order_id: string;
    order_number: string;
    tracking_token: string;
    payment_method_label: string;
    payment_instructions: string;
};

export type SubmitGuestCheckoutResult =
    | { status: "success"; order: CheckoutSuccess }
    | { status: "error"; message: string };

export async function submitGuestCheckout(
    input: GuestCheckoutRequest,
): Promise<SubmitGuestCheckoutResult> {
    try {
        const request = prepareGuestCheckoutRequest(input);
        const supabase = createServiceClient();

        const { data, error } = await supabase.rpc(
            "create_guest_checkout_order",
            {
                p_store_slug: request.storeSlug,
                p_customer_name: request.customerName,
                p_customer_email: request.customerEmail,
                p_customer_phone: request.customerPhone,
                p_address_line_1: request.addressLine1,
                p_address_line_2: request.addressLine2,
                p_city: request.city,
                p_state: request.state,
                p_postal_code: request.postalCode,
                p_country: request.country,
                p_payment_method_id: request.paymentMethodId,
                p_items: request.items,
            },
        );

        if (error) {
            return {
                status: "error",
                message: error.message,
            };
        }

        const order = (data as CheckoutSuccess[] | null)?.[0];

        if (!order) {
            return {
                status: "error",
                message: "Could not create your order.",
            };
        }

        return {
            status: "success",
            order,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Could not place your order.",
        };
    }
}