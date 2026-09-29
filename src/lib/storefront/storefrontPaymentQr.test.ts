import { describe, expect, it } from "vitest";
import {
  PAYMENT_QR_GUIDANCE,
  getStorefrontPaymentQrView,
} from "./storefrontPaymentQr";

describe("storefront payment QR view", () => {
  it("returns no QR view when a payment method has no QR path", () => {
    expect(
      getStorefrontPaymentQrView({
        supabaseUrl: "https://example-project.supabase.co",
        qrImagePath: null,
      }),
    ).toBeNull();
  });

  it("creates the customer-facing QR image and payment guidance", () => {
    expect(
      getStorefrontPaymentQrView({
        supabaseUrl: "https://example-project.supabase.co",
        qrImagePath:
          "stores/store-1/payment-methods/method-1/tng.png",
      }),
    ).toEqual({
      imageUrl:
        "https://example-project.supabase.co/storage/v1/object/public/payment-qr-codes/stores/store-1/payment-methods/method-1/tng.png",
      guidance: PAYMENT_QR_GUIDANCE,
    });
  });

  it("uses the QR path from the newly selected payment method", () => {
    expect(
      getStorefrontPaymentQrView({
        supabaseUrl: "https://example-project.supabase.co",
        qrImagePath:
          "stores/store-1/payment-methods/method-2/bank.png",
      }),
    ).toMatchObject({
      imageUrl:
        "https://example-project.supabase.co/storage/v1/object/public/payment-qr-codes/stores/store-1/payment-methods/method-2/bank.png",
    });
  });
});