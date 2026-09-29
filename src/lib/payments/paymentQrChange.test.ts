import { describe, expect, it } from "vitest";
import { getPaymentQrImageChange } from "./paymentQrChange";

describe("payment QR image changes", () => {
  it("uses a replacement QR and marks the old QR for cleanup", () => {
    expect(
      getPaymentQrImageChange({
        currentQrImagePath:
          "stores/store-1/payment-methods/method-1/old.png",
        replacementQrImagePath:
          "stores/store-1/payment-methods/method-1/new.png",
        removeQr: false,
      }),
    ).toEqual({
      qrImagePath:
        "stores/store-1/payment-methods/method-1/new.png",
      obsoleteQrImagePath:
        "stores/store-1/payment-methods/method-1/old.png",
    });
  });

  it("clears a QR and marks its existing image for cleanup", () => {
    expect(
      getPaymentQrImageChange({
        currentQrImagePath:
          "stores/store-1/payment-methods/method-1/current.png",
        replacementQrImagePath: null,
        removeQr: true,
      }),
    ).toEqual({
      qrImagePath: null,
      obsoleteQrImagePath:
        "stores/store-1/payment-methods/method-1/current.png",
    });
  });

  it("keeps the current QR when no replacement or removal is requested", () => {
    expect(
      getPaymentQrImageChange({
        currentQrImagePath:
          "stores/store-1/payment-methods/method-1/current.png",
        replacementQrImagePath: null,
        removeQr: false,
      }),
    ).toEqual({
      qrImagePath:
        "stores/store-1/payment-methods/method-1/current.png",
      obsoleteQrImagePath: null,
    });
  });
});