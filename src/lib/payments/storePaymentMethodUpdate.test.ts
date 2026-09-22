import { describe, expect, it } from "vitest";
import { prepareStorePaymentMethodUpdate } from "./storePaymentMethodUpdate";

describe("store payment method update preparation", () => {
  it("trims an editable payment method configuration", () => {
    const result = prepareStorePaymentMethodUpdate({
      label: "  Bank Transfer  ",
      instructions: "  Transfer to Maybank account 1234.  ",
      isEnabled: true,
    });

    expect(result).toEqual({
      data: {
        label: "Bank Transfer",
        instructions: "Transfer to Maybank account 1234.",
        isEnabled: true,
      },
    });
  });

  it("rejects a payment method without a customer-facing name", () => {
    const result = prepareStorePaymentMethodUpdate({
      label: "   ",
      instructions: "",
      isEnabled: false,
    });

    expect(result).toEqual({
      error: "Payment method name is required.",
    });
  });
});