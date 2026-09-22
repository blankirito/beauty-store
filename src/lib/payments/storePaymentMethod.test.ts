import { describe, expect, it } from "vitest";
import { toStorePaymentMethod } from "./storePaymentMethod";

describe("store payment method mapping", () => {
  it("maps an enabled database payment method for checkout and admin settings", () => {
    const method = toStorePaymentMethod({
      id: "method-1",
      store_id: "store-1",
      code: "bank_transfer",
      label: "Bank Transfer",
      instructions: "Transfer to Maybank account 1234.",
      is_enabled: true,
      sort_order: 1,
    });

    expect(method).toEqual({
      id: "method-1",
      storeId: "store-1",
      code: "bank_transfer",
      label: "Bank Transfer",
      instructions: "Transfer to Maybank account 1234.",
      isEnabled: true,
      sortOrder: 1,
    });
  });
});