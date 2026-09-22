import { describe, expect, it } from "vitest";
import { prepareProductArchive } from "./productArchive";

describe("product archive preparation", () => {
  it("hides an archived product from the storefront", () => {
    expect(prepareProductArchive()).toEqual({
      status: "archived",
      is_active: false,
    });
  });
});