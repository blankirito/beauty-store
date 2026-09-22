import type { PaymentStatus } from "./adminOrder";

type DatabaseOrderItem = {
    product_id: string | null;
    product_name: string;
    product_sku: string;
    unit_price: number;
    quantity: number;
    line_total: number;
};

type DatabaseShippingAddress = {
    recipient_name: string;
    phone: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
};

type DatabaseOrderDetail = {
    customer_id: string | null;
    customer_phone: string | null;
    payment_status: string;
    payment_method: string | null;
    subtotal: number;
    shipping_fee: number;
    tracking_carrier: string | null;
    tracking_number: string | null;
    estimated_delivery_date: string | null;
    order_items?: DatabaseOrderItem[] | null;
    order_shipping_addresses?:
    | DatabaseShippingAddress
    | DatabaseShippingAddress[]
    | null;
};

export type AdminOrderDetail = {
    customerId: string | null;
    customerPhone: string | null;
    paymentStatus: PaymentStatus;
    paymentMethod: string | null;
    subtotal: number;
    shippingFee: number;
    trackingCarrier: string | null;
    trackingNumber: string | null;
    estimatedDeliveryDate: string | null;
    items: Array<{
        productId: string | null;
        productName: string;
        sku: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
    }>;
    shippingAddress: {
        recipientName: string;
        phone: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    } | null;
};

const paymentStatusLabels: Record<string, PaymentStatus> = {
    pending: "Pending",
    paid: "Paid",
    refunded: "Refunded",
    failed: "Failed",
};

export function toAdminOrderDetail(
    order: DatabaseOrderDetail,
): AdminOrderDetail {
    const shippingAddresses = order.order_shipping_addresses;

    const address = Array.isArray(shippingAddresses)
        ? (shippingAddresses[0] ?? null)
        : (shippingAddresses ?? null);

    return {
        customerId: order.customer_id,
        customerPhone: order.customer_phone,
        paymentStatus: paymentStatusLabels[order.payment_status] ?? "Pending",
        paymentMethod: order.payment_method,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        trackingCarrier: order.tracking_carrier,
        trackingNumber: order.tracking_number,
        estimatedDeliveryDate: order.estimated_delivery_date,
        items: (order.order_items ?? []).map((item) => ({
            productId: item.product_id,
            productName: item.product_name,
            sku: item.product_sku,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            lineTotal: item.line_total,
        })),
        shippingAddress: address
            ? {
                recipientName: address.recipient_name,
                phone: address.phone,
                addressLine1: address.address_line_1,
                addressLine2: address.address_line_2,
                city: address.city,
                state: address.state,
                postalCode: address.postal_code,
                country: address.country,
            }
            : null,
    };
}