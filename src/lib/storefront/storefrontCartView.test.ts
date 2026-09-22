import { describe, expect, it } from "vitest";
import type { StorefrontCartLine } from "./storefrontCart";
import { toStorefrontCartView } from "./storefrontCartView";

describe("storefront cart view", () => {
  it("combines current-store cart quantities with loaded products", () => {
    const cartItems: StorefrontCartLine[] = [
      {
        storeSlug: "boutique-demo-store",
        productId: "product-uuid-1",
        quantity: 2,
        isSelected: true,
      },
    ];

    const items = toStorefrontCartView(cartItems, [
      {
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
        imagePath: null,
        imageAlt: null,
      },
    ]);

    expect(items).toEqual([
      {
        productId: "product-uuid-1",
        quantity: 2,
        product: {
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
          imagePath: null,
          imageAlt: null,
        },
      },
    ]);
  });

  it("omits a cart line when its product is no longer available", () => {
    const cartItems: StorefrontCartLine[] = [
      {
        storeSlug: "boutique-demo-store",
        productId: "removed-product",
        quantity: 1,
        isSelected: true,
      },
    ];

    expect(toStorefrontCartView(cartItems, [])).toEqual([]);
  });
});