import { describe, expect, it } from "vitest";
import { getAdminLoadingCardKeys } from "./adminLoading";

describe("admin loading skeleton", () => {
  it("keeps three content skeleton cards ready for admin navigation", () => {
    expect(getAdminLoadingCardKeys()).toEqual([
      "admin-loading-card-1",
      "admin-loading-card-2",
      "admin-loading-card-3",
    ]);
  });
});