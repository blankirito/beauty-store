import { describe, expect, it } from "vitest";
import { toAdminOrderDetail } from "./adminOrderDetail";

describe("admin order detail mapping", () => {
    it("maps item, address, payment, and tracking snapshots from an order", () => {
        const detail = toAdminOrderDetail({
            customer_id: null,
            customer_phone: "012-345 6789",
            payment_status: "paid",
            payment_method: "Manual test order",
            payment_method_label: "Test Payment",
            subtotal: 1,
            shipping_fee: 0,
            tracking_carrier: null,
            tracking_number: null,
            estimated_delivery_date: null,
            order_items: [
                {
                    product_id: "product-1",
                    product_name: "test",
                    product_sku: "test-001",
                    unit_price: 1,
                    quantity: 1,
                    line_total: 1,
                    products: {
  product_images: [
    {
      storage_path: "products/test.jpg",
      is_primary: true,
      sort_order: 0,
    },
  ],
},
                },
            ],
            order_shipping_addresses: [
                {
                    recipient_name: "Test Customer",
                    phone: "012-345 6789",
                    address_line_1: "1 Jalan Demo",
                    address_line_2: null,
                    city: "Kuala Lumpur",
                    state: "Kuala Lumpur",
                    postal_code: "50000",
                    country: "Malaysia",
                },
            ],
        });

        expect(detail).toEqual({
            customerId: null,
            customerPhone: "012-345 6789",
            paymentStatus: "Paid",
            paymentMethod: "Test Payment",
            subtotal: 1,
            shippingFee: 0,
            trackingCarrier: null,
            trackingNumber: null,
            estimatedDeliveryDate: null,
            items: [
                {
                    productId: "product-1",
                    productName: "test",
                    sku: "test-001",
                    quantity: 1,
                    unitPrice: 1,
                    lineTotal: 1,
                    imagePath: "products/test.jpg",
                },
            ],
            shippingAddress: {
                recipientName: "Test Customer",
                phone: "012-345 6789",
                addressLine1: "1 Jalan Demo",
                addressLine2: null,
                city: "Kuala Lumpur",
                state: "Kuala Lumpur",
                postalCode: "50000",
                country: "Malaysia",
            },
        });
    });
    it("maps a one-to-one shipping address returned as an object", () => {
        const detail = toAdminOrderDetail({
            customer_id: null,
            customer_phone: "012-345 6789",
            payment_status: "paid",
            payment_method: "Manual test order",
            subtotal: 1,
            shipping_fee: 0,
            tracking_carrier: null,
            tracking_number: null,
            estimated_delivery_date: null,
            order_items: [],
            order_shipping_addresses: {
                recipient_name: "Test Customer",
                phone: "012-345 6789",
                address_line_1: "1 Jalan Demo",
                address_line_2: null,
                city: "Kuala Lumpur",
                state: "Kuala Lumpur",
                postal_code: "50000",
                country: "Malaysia",
            },
        });

        expect(detail.shippingAddress).toEqual({
            recipientName: "Test Customer",
            phone: "012-345 6789",
            addressLine1: "1 Jalan Demo",
            addressLine2: null,
            city: "Kuala Lumpur",
            state: "Kuala Lumpur",
            postalCode: "50000",
            country: "Malaysia",
        });
    });
});