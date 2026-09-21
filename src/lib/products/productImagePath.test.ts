import { describe, expect, it } from "vitest";
import { buildProductImagePath } from "./productImagePath";

describe("product image path", () => {
  it("places an image inside its store and product folder", () => {
    expect(
      buildProductImagePath({
        storeId: "store-123",
        productId: "product-456",
        imageId: "image-789",
        extension: "webp",
      }),
    ).toBe(
      "stores/store-123/products/product-456/image-789.webp",
    );
  });
});