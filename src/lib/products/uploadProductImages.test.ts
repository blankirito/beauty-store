import { describe, expect, it } from "vitest";
import { getProductImageSortOrder } from "./productImageOrder";

describe("product image upload ordering", () => {
  it("places new images after the images that already exist", () => {
    expect(getProductImageSortOrder(3, 0)).toBe(3);
    expect(getProductImageSortOrder(3, 1)).toBe(4);
  });
});