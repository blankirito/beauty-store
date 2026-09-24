import { describe, expect, it } from "vitest";
import { prepareStorefrontAccountUpdate } from "./storefrontAccount";

describe("prepareStorefrontAccountUpdate", () => {
  it("trims the customer's name and phone before saving", () => {
    expect(
      prepareStorefrontAccountUpdate({
        fullName: "  Ava Tan  ",
        phone: "  012-345 6789  ",
      }),
    ).toEqual({
      fullName: "Ava Tan",
      phone: "012-345 6789",
    });
  });

  it("rejects an empty full name", () => {
    expect(() =>
      prepareStorefrontAccountUpdate({
        fullName: "   ",
        phone: "012-345 6789",
      }),
    ).toThrow("Enter your full name.");
  });
});