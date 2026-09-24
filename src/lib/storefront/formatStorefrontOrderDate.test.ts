import { describe, expect, it } from "vitest";
import {
  formatStorefrontOrderDate,
  formatStorefrontOrderDateTime,
} from "./formatStorefrontOrderDate";

describe("storefront order date formatting", () => {
  it("formats an order date in Malaysia time", () => {
    expect(
      formatStorefrontOrderDate("2026-09-23T12:44:00.000Z"),
    ).toBe("23 Sept 2026");
  });

  it("formats a delivery update in Malaysia time", () => {
    expect(
      formatStorefrontOrderDateTime("2026-09-23T12:44:00.000Z"),
    ).toBe("23 Sept 2026, 8:44 pm");
  });
});