import { describe, expect, it } from "vitest";
import { prepareNewStorePaymentMethod } from "./newStorePaymentMethod";

describe("new store payment method preparation", () => {
  it("prepares an enabled custom payment method", () => {
    const result = prepareNewStorePaymentMethod({
      label: "  DuitNow Transfer  ",
      instructions: "  Transfer using the DuitNow QR code.  ",
    });

    expect(result).toEqual({
      data: {
        label: "DuitNow Transfer",
        instructions: "Transfer using the DuitNow QR code.",
        isEnabled: true,
      },
    });
  });

  it("rejects a custom payment method without a name", () => {
    const result = prepareNewStorePaymentMethod({
      label: "  ",
      instructions: "",
    });

    expect(result).toEqual({
      error: "Payment method name is required.",
    });
  });
});