"use server";

import { createServiceClient } from "@/lib/supabase/service";
import {
    prepareGuestCheckoutRequest,
    type GuestCheckoutRequest,
} from "@/lib/storefront/guestCheckout";
import { buildCheckoutOrderRpcParams } from "@/lib/storefront/checkoutOrderRpc";
import { createClient } from "@/lib/supabase/server";

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

async function createNewOrderNotifications({
    order,
    customerName,
}: {
    order: CheckoutSuccess;
    customerName: string;
}) {
    const supabase = createServiceClient();

    const { error } = await supabase.rpc(
        "create_new_order_notifications",
        {
            p_order_id: order.order_id,
            p_customer_name: customerName,
        },
    );

    if (error) {
        throw new Error(error.message);
    }
}

export async function submitGuestCheckout(
    input: GuestCheckoutRequest,
): Promise<SubmitGuestCheckoutResult> {
    try {
        const request = prepareGuestCheckoutRequest(input);

        const authSupabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await authSupabase.auth.getUser();

        if (authError) {
            throw new Error("Could not verify your account. Please try again.");
        }

        const supabase = createServiceClient();

        const { data, error } = await supabase.rpc(
            "create_guest_checkout_order",
            buildCheckoutOrderRpcParams(request, user?.id ?? null),
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

        try {
            await createNewOrderNotifications({
                order,
                customerName: request.customerName,
            });
        } catch (notificationError) {
            console.error(
                "Could not create new-order notifications.",
                notificationError,
            );
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