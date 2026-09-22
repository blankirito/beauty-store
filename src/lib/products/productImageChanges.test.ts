import { describe, expect, it } from "vitest";
import { prepareProductImageChanges } from "./productImageChanges";

describe("product image changes", () => {
  it("removes missing images and keeps the selected primary image", () => {
    expect(
      prepareProductImageChanges({
        existingImagePaths: [
          "stores/store-1/products/product-1/first.webp",
          "stores/store-1/products/product-1/second.webp",
          "stores/store-1/products/product-1/third.webp",
        ],
        desiredImagePaths: [
          "stores/store-1/products/product-1/first.webp",
          "stores/store-1/products/product-1/third.webp",
        ],
        primaryImagePath:
          "stores/store-1/products/product-1/third.webp",
      }),
    ).toEqual({
      removedImagePaths: [
        "stores/store-1/products/product-1/second.webp",
      ],
      images: [
        {
          storagePath:
            "stores/store-1/products/product-1/first.webp",
          sortOrder: 0,
          isPrimary: false,
        },
        {
          storagePath:
            "stores/store-1/products/product-1/third.webp",
          sortOrder: 1,
          isPrimary: true,
        },
      ],
    });
  });
});