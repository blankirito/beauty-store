import { describe, expect, it } from "vitest";
import { getAdminStoreId } from "./adminStore";

describe("admin store selection", () => {
  it("uses the first owner or admin store for the current user", () => {
    expect(
      getAdminStoreId([
        { storeId: "store-staff", role: "staff" },
        { storeId: "store-owner", role: "owner" },
      ]),
    ).toBe("store-owner");
  });

  it("returns null when the user only has staff access", () => {
    expect(
      getAdminStoreId([{ storeId: "store-staff", role: "staff" }]),
    ).toBeNull();
  });
});