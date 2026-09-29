import { describe, expect, it } from "vitest";
import {
  buildPaymentQrImagePath,
  getPublicPaymentQrUrl,
  hasPaymentQrImageSignature,
  preparePaymentQrUpload,
} from "./paymentQrCode";

describe("payment QR code upload preparation", () => {
  it("accepts supported image types and normalizes their extensions", () => {
    expect(
      preparePaymentQrUpload({
        name: "tng.jpeg",
        type: "image/jpeg",
        size: 1024,
      }),
    ).toEqual({
      data: {
        extension: "jpg",
      },
    });

    expect(
      preparePaymentQrUpload({
        name: "duitnow.png",
        type: "image/png",
        size: 1024,
      }),
    ).toEqual({
      data: {
        extension: "png",
      },
    });

    expect(
      preparePaymentQrUpload({
        name: "bank.webp",
        type: "image/webp",
        size: 1024,
      }),
    ).toEqual({
      data: {
        extension: "webp",
      },
    });
  });

  it("rejects a file that is not a supported image", () => {
    expect(
      preparePaymentQrUpload({
        name: "payment.pdf",
        type: "application/pdf",
        size: 1024,
      }),
    ).toEqual({
      error: "Upload a JPG, PNG, or WebP QR image.",
    });
  });

  it("rejects a QR image larger than 2 MB", () => {
    expect(
      preparePaymentQrUpload({
        name: "large.png",
        type: "image/png",
        size: 2 * 1024 * 1024 + 1,
      }),
    ).toEqual({
      error: "QR image must be 2 MB or smaller.",
    });
  });

  it("recognizes JPEG, PNG, and WebP file signatures", () => {
    expect(
      hasPaymentQrImageSignature(
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]),
        "jpg",
      ),
    ).toBe(true);

    expect(
      hasPaymentQrImageSignature(
        Uint8Array.from([
          0x89,
          0x50,
          0x4e,
          0x47,
          0x0d,
          0x0a,
          0x1a,
          0x0a,
        ]),
        "png",
      ),
    ).toBe(true);

    expect(
      hasPaymentQrImageSignature(
        Uint8Array.from([
          0x52,
          0x49,
          0x46,
          0x46,
          0x00,
          0x00,
          0x00,
          0x00,
          0x57,
          0x45,
          0x42,
          0x50,
        ]),
        "webp",
      ),
    ).toBe(true);
  });

  it("rejects bytes that do not match the claimed image type", () => {
    expect(
      hasPaymentQrImageSignature(
        Uint8Array.from([0x25, 0x50, 0x44, 0x46]),
        "png",
      ),
    ).toBe(false);

    expect(
      hasPaymentQrImageSignature(
        Uint8Array.from([
          0x89,
          0x50,
          0x4e,
          0x47,
          0x0d,
          0x0a,
          0x1a,
          0x0a,
        ]),
        "jpg",
      ),
    ).toBe(false);
  });

  it("builds an isolated storage path for a payment method", () => {
    expect(
      buildPaymentQrImagePath({
        storeId: "store-1",
        paymentMethodId: "method-1",
        imageId: "image-1",
        extension: "png",
      }),
    ).toBe("stores/store-1/payment-methods/method-1/image-1.png");
  });

  it("builds the public URL for a payment QR image", () => {
    expect(
      getPublicPaymentQrUrl(
        "https://example-project.supabase.co",
        "stores/store-1/payment-methods/method-1/image-1.png",
      ),
    ).toBe(
      "https://example-project.supabase.co/storage/v1/object/public/payment-qr-codes/stores/store-1/payment-methods/method-1/image-1.png",
    );
  });
});