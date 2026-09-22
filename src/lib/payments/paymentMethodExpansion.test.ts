import { describe, expect, it } from "vitest";
import { getNextExpandedPaymentMethodId } from "./paymentMethodExpansion";

describe("payment method expansion", () => {
  it("expands the payment method the admin selects", () => {
    expect(getNextExpandedPaymentMethodId(null, "method-bank")).toBe(
      "method-bank",
    );
  });

  it("closes a payment method when the admin selects it again", () => {
    expect(
      getNextExpandedPaymentMethodId("method-bank", "method-bank"),
    ).toBeNull();
  });

  it("switches the expanded card when the admin selects another method", () => {
    expect(
      getNextExpandedPaymentMethodId("method-bank", "method-cod"),
    ).toBe("method-cod");
  });
});