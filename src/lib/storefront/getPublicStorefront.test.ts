import { describe, expect, it } from "vitest";
import { toStorefrontPaymentMethod } from "./storefrontPaymentMethod";

describe("public storefront payment method mapping", () => {
  it("keeps an optional QR path available to checkout", () => {
    expect(
      toStorefrontPaymentMethod({
        id: "method-1",
        label: "Touch 'n Go eWallet",
        instructions: "Scan the QR code and pay before placing your order.",
        qr_image_path: "stores/store-1/payment-methods/method-1/tng.png",
      }),
    ).toEqual({
      id: "method-1",
      label: "Touch 'n Go eWallet",
      instructions: "Scan the QR code and pay before placing your order.",
      qrImagePath: "stores/store-1/payment-methods/method-1/tng.png",
    });
  });
});