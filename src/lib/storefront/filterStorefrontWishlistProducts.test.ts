import { describe, expect, it } from "vitest";
import { filterStorefrontWishlistProducts } from "./filterStorefrontWishlistProducts";
import type { StorefrontProduct } from "./storefrontProduct";

const products: StorefrontProduct[] = [
  {
    id: "serum-1",
    storeId: "boutique-demo-store-id",
    slug: "hydrating-serum",
    name: "Hydrating Serum",
    description: "A lightweight daily hydration treatment.",
    category: "Skincare",
    price: 89,
    stock: 12,
    rating: 4.8,
    reviewCount: 24,
    isNew: true,
    imagePath: null,
    imageAlt: null,
  },
  {
    id: "candle-1",
    storeId: "boutique-demo-store-id",
    slug: "amber-candle",
    name: "Amber Candle",
    description: "Warm amber and sandalwood fragrance.",
    category: "Home Fragrance",
    price: 65,
    stock: 8,
    rating: 4.5,
    reviewCount: 10,
    isNew: false,
    imagePath: null,
    imageAlt: null,
  },
];

describe("filterStorefrontWishlistProducts", () => {
  it("returns only products the customer has wishlisted", () => {
    expect(
      filterStorefrontWishlistProducts(products, new Set(["candle-1"])),
    ).toEqual([products[1]]);
  });

  it("returns no products when the customer has no wishlist items", () => {
    expect(
      filterStorefrontWishlistProducts(products, new Set()),
    ).toEqual([]);
  });
});