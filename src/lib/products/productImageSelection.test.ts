import { describe, expect, it } from "vitest";
import {
  getInitialProductImagePath,
} from "./productImageSelection";

describe("product image selection", () => {
  it("uses the primary image for the initial detail view", () => {
    expect(
      getInitialProductImagePath(
        [
          "stores/store-1/products/product-1/first.webp",
          "stores/store-1/products/product-1/second.webp",
        ],
        "stores/store-1/products/product-1/second.webp",
      ),
    ).toBe(
      "stores/store-1/products/product-1/second.webp",
    );
  });
});