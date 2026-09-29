import { describe, expect, it } from "vitest";
import type { StorefrontProduct } from "./storefrontProduct";
import { selectNewArrivals } from "./selectNewArrivals";

function product(id: string): StorefrontProduct {
  return {
    id,
    storeId: "store-1",
    slug: id,
    name: id,
    description: "",
    category: "Skincare",
    price: 10,
    stock: 5,
    rating: 0,
    reviewCount: 0,
    isNew: true,
    imagePath: null,
    imageAlt: null,
  };
}

describe("selectNewArrivals", () => {
  it("keeps the existing newest-first order and limits home to four products", () => {
    const products = [
      product("newest"),
      product("second"),
      product("third"),
      product("fourth"),
      product("fifth"),
    ];

    expect(selectNewArrivals(products, 4).map((item) => item.id)).toEqual([
      "newest",
      "second",
      "third",
      "fourth",
    ]);

    expect(products.map((item) => item.id)).toEqual([
      "newest",
      "second",
      "third",
      "fourth",
      "fifth",
    ]);
  });

  it("returns all available products when fewer than the limit exist", () => {
    expect(
      selectNewArrivals([product("newest"), product("second")], 24),
    ).toHaveLength(2);
  });

  it("limits the collection page to twenty-four products", () => {
    const products = Array.from({ length: 25 }, (_, index) =>
      product(`product-${index + 1}`),
    );

    expect(selectNewArrivals(products, 24)).toHaveLength(24);
  });
});