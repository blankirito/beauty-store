import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  toGuestOrderTracking,
  type GuestOrderTrackingRpcRow,
} from "./guestOrderTracking";

describe("guest order tracking", () => {
  it("includes the product image path in the guest tracking database response", () => {
    const migration = readFileSync(
      resolve(process.cwd(), "supabase/migrations/018_guest_order_tracking_images.sql"),
      "utf8",
    );

    expect(migration).toContain("'imagePath'");
    expect(migration).toContain("product_images.storage_path");
  });

  it("maps the exact camelCase JSON returned by the tracking function", () => {
    const row: GuestOrderTrackingRpcRow = {
      order_number: "ORD-001001",
      customer_name: "Test Customer",
      payment_status: "pending",
      fulfillment_status: "new",
      payment_method_label: "Bank Transfer",
      payment_method_instructions: "Transfer to the store account.",
      subtotal: 7,
      shipping_fee: 0,
      total: 7,
      tracking_carrier: null,
      tracking_number: null,
      estimated_delivery_date: null,
      created_at: "2026-09-22T11:21:00.000Z",
      shipping_address: {
        recipientName: "Test Customer",
        phone: "12345678",
        addressLine1: "Jalan Demo",
        addressLine2: null,
        city: "Kuala Lumpur",
        state: "KL",
        postalCode: "50000",
        country: "Malaysia",
      },
      items: [
        {
          name: "Guc",
          sku: "High",
          unitPrice: 7,
          quantity: 1,
          lineTotal: 7,
        },
      ],
      events: [
        {
          title: "Order placed",
          note: "Guest checkout order created.",
          fulfillmentStatus: "new",
          createdAt: "2026-09-22T11:21:00.000Z",
        },
      ],
    };

    expect(toGuestOrderTracking(row)).toEqual({
      orderNumber: "ORD-001001",
      customerName: "Test Customer",
      paymentStatus: "pending",
      fulfillmentStatus: "new",
      paymentMethodLabel: "Bank Transfer",
      paymentMethodInstructions: "Transfer to the store account.",
      subtotal: 7,
      shippingFee: 0,
      total: 7,
      trackingCarrier: null,
      trackingNumber: null,
      estimatedDeliveryDate: null,
      createdAt: "2026-09-22T11:21:00.000Z",
      shippingAddress: row.shipping_address,
      items: row.items,
      events: row.events,
    });
  });
});
