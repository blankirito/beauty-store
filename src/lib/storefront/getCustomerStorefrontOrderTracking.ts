import { createClient } from "@/lib/supabase/server";
import type { GuestOrderTracking } from "./guestOrderTracking";
import { getShippingAddress } from "./storefrontOrderView";

type ShippingAddressRow = {
    recipient_name: string;
    phone: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
};

type ProductImageRow = {
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
};

export async function getCustomerStorefrontOrderTracking(
    storeId: string,
    orderNumber: string,
    userId: string,
): Promise<GuestOrderTracking | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
      order_number,
      customer_name,
      payment_status,
      fulfillment_status,
      payment_method,
      payment_method_label,
      payment_method_instructions,
      subtotal,
      shipping_fee,
      total,
      tracking_carrier,
      tracking_number,
      estimated_delivery_date,
      created_at,
      order_items (
        product_name,
        product_sku,
        unit_price,
        quantity,
        line_total,
        products (
          product_images (
            storage_path,
            is_primary,
            sort_order
          )
        )
      ),
      order_shipping_addresses (
        recipient_name,
        phone,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country
      ),
      order_events (
        title,
        note,
        fulfillment_status,
        created_at
      )
    `)
        .eq("store_id", storeId)
        .eq("order_number", orderNumber)
        .eq("customer_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Could not load customer storefront order:", error);
        return null;
    }

    if (!data) {
        console.error("Customer storefront order was not found:", {
            storeId,
            orderNumber,
            userId,
        });
        return null;
    }

    const addressRelation = data.order_shipping_addresses as unknown as
        | ShippingAddressRow
        | ShippingAddressRow[]
        | null;

    const shippingAddress = getShippingAddress(addressRelation);

    if (!shippingAddress) {
        console.error("Customer storefront order has no shipping address:", {
            storeId,
            orderNumber,
        });
        return null;
    }

    return {
        orderNumber: data.order_number,
        customerName: data.customer_name,
        paymentStatus: data.payment_status,
        fulfillmentStatus: data.fulfillment_status,
        paymentMethodLabel:
            data.payment_method_label ?? data.payment_method ?? "Payment pending",
        paymentMethodInstructions:
            data.payment_method_instructions ??
            "Payment details are recorded with your order.",
        subtotal: Number(data.subtotal),
        shippingFee: Number(data.shipping_fee),
        total: Number(data.total),
        trackingCarrier: data.tracking_carrier,
        trackingNumber: data.tracking_number,
        estimatedDeliveryDate: data.estimated_delivery_date,
        createdAt: data.created_at,
        shippingAddress: {
            recipientName: shippingAddress.recipient_name,
            phone: shippingAddress.phone,
            addressLine1: shippingAddress.address_line_1,
            addressLine2: shippingAddress.address_line_2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postal_code,
            country: shippingAddress.country,
        },
        items: (data.order_items ?? []).map((item) => {
            const product = item.products as unknown as {
                product_images: ProductImageRow[];
            } | null;
            const image =
                product?.product_images?.find((current) => current.is_primary) ??
                product?.product_images
                    ?.slice()
                    .sort((first, second) => first.sort_order - second.sort_order)[0];

            return {
                name: item.product_name,
                sku: item.product_sku,
                unitPrice: Number(item.unit_price),
                quantity: item.quantity,
                lineTotal: Number(item.line_total),
                imagePath: image?.storage_path ?? null,
            };
        }),
        events: (data.order_events ?? []).map((event) => ({
            title: event.title,
            note: event.note ?? "",
            fulfillmentStatus: event.fulfillment_status ?? "",
            createdAt: event.created_at,
        })),
    };
}
