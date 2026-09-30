import { describe, expect, it } from "vitest";
import { formatAdminOrderDateTime } from "./formatAdminOrderDate";

describe("admin order date formatting", () => {
  it("formats order timeline timestamps in Malaysia time", () => {
    expect(
      formatAdminOrderDateTime("2026-09-23T12:44:00.000Z"),
    ).toBe("23 Sept 2026, 8:44 pm");
  });
});