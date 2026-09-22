import { describe, expect, it } from "vitest";
import { prepareGuestCheckoutRequest } from "./guestCheckout";

describe("guest checkout request", () => {
  it("keeps only validated shopper details, payment choice, and product quantities", () => {
    expect(
      prepareGuestCheckoutRequest({
        storeSlug: " Boutique-Demo-Store ",
        customerName: "  Test Customer  ",
        customerEmail: "  test@example.com ",
        customerPhone: " 0123456789 ",
        addressLine1: "  1 Jalan Demo ",
        addressLine2: " Unit 10 ",
        city: " Kuala Lumpur ",
        state: " Kuala Lumpur ",
        postalCode: " 50000 ",
        country: " Malaysia ",
        paymentMethodId: "payment-method-uuid",
        items: [
          {
            productId: "product-uuid-1",
            quantity: 2,
            price: 999999,
          },
        ],
      }),
    ).toEqual({
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
      items: [
        {
          productId: "product-uuid-1",
          quantity: 2,
        },
      ],
    });
  });

  it("rejects checkout when required guest details are missing", () => {
    expect(() =>
      prepareGuestCheckoutRequest({
        storeSlug: "boutique-demo-store",
        customerName: "",
        customerEmail: "test@example.com",
        customerPhone: "0123456789",
        addressLine1: "1 Jalan Demo",
        addressLine2: "",
        city: "Kuala Lumpur",
        state: "Kuala Lumpur",
        postalCode: "50000",
        country: "Malaysia",
        paymentMethodId: "payment-method-uuid",
        items: [{ productId: "product-uuid-1", quantity: 1 }],
      }),
    ).toThrow("Enter your name.");
  });
});