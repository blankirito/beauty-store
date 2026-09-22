import { describe, expect, it } from "vitest";
import { toStorefrontProduct } from "./storefrontProduct";

describe("storefront product mapping", () => {
  it("maps an active database product for a public store page", () => {
    const product = toStorefrontProduct({
      id: "product-uuid-1",
      store_id: "store-uuid-1",
      slug: "glow-serum",
      name: "Glow Serum",
      description: "Premium hydrating serum",
      category: "Skincare",
      price: 89,
      stock: 12,
      rating: 4.9,
      review_count: 18,
      is_new: true,
      product_images: [
        {
          storage_path: "store-uuid-1/products/glow-serum-primary.jpg",
          alt_text: "Glow Serum bottle",
          sort_order: 0,
          is_primary: true,
        },
      ],
    });

    expect(product).toEqual({
      id: "product-uuid-1",
      storeId: "store-uuid-1",
      slug: "glow-serum",
      name: "Glow Serum",
      description: "Premium hydrating serum",
      category: "Skincare",
      price: 89,
      stock: 12,
      rating: 4.9,
      reviewCount: 18,
      isNew: true,
      imagePath: "store-uuid-1/products/glow-serum-primary.jpg",
      imageAlt: "Glow Serum bottle",
    });
  });

  it("uses no image when a product has no uploaded image", () => {
    const product = toStorefrontProduct({
      id: "product-uuid-2",
      store_id: "store-uuid-1",
      slug: "gentle-cleanser",
      name: "Gentle Cleanser",
      description: "Daily cleanser",
      category: "Skincare",
      price: 39,
      stock: 0,
      rating: 0,
      review_count: 0,
      is_new: false,
      product_images: [],
    });

    expect(product.imagePath).toBeNull();
    expect(product.imageAlt).toBeNull();
  });
});