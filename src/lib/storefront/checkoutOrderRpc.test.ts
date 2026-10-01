import { describe, expect, it } from "vitest";
import type { GuestCheckoutRequest } from "./guestCheckout";
import { buildCheckoutOrderRpcParams } from "./checkoutOrderRpc";

const request: GuestCheckoutRequest = {
  storeSlug: "boutique-demo-store",
  customerName: "Test Customer",
  customerEmail: "test@example.com",
  customerPhone: "0123456789",
  addressLine1: "1 Jalan Demo",
  addressLine2: "Unit 10",
  city: "Kuala Lumpur",
  state: "Kuala Lumpur",
  postalCode: "50000",
  country: "Malaysia",
  paymentMethodId: "payment-method-uuid",
  items: [{ productId: "product-uuid-1", quantity: 2 }],
};

describe("checkout order RPC parameters", () => {
  it("includes the trusted signed-in customer ID", () => {
    expect(
      buildCheckoutOrderRpcParams(request, "customer-uuid"),
    ).toEqual({
      p_store_slug: "boutique-demo-store",
      p_customer_name: "Test Customer",
      p_customer_email: "test@example.com",
      p_customer_phone: "0123456789",
      p_address_line_1: "1 Jalan Demo",
      p_address_line_2: "Unit 10",
      p_city: "Kuala Lumpur",
      p_state: "Kuala Lumpur",
      p_postal_code: "50000",
      p_country: "Malaysia",
      p_payment_method_id: "payment-method-uuid",
      p_items: [{ productId: "product-uuid-1", quantity: 2 }],
      p_customer_id: "customer-uuid",
    });
  });

  it("keeps guest checkout unassociated with a customer", () => {
    expect(buildCheckoutOrderRpcParams(request, null)).toMatchObject({
      p_customer_id: null,
    });
  });
  it("keeps a missing sign-in session as an unassociated guest", () => {
    expect(
      buildCheckoutOrderRpcParams(request, undefined),
    ).toMatchObject({
      p_customer_id: null,
    });
  });
});