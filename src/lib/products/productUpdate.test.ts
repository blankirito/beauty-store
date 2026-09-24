import { describe, expect, it } from "vitest";
import { prepareProductUpdate } from "./productUpdate";

describe("product update preparation", () => {
  it("only includes fields that can be edited in the product form", () => {
    expect(
      prepareProductUpdate({
        name: "  Glow Serum  ",
        category: "Skincare",
        description: "Updated product description",
        price: "89.00",
        stock: "12",
        lowStockThreshold: "5",
        collection: "",
        dimensions: "30 ml bottle",
        weight: "",
        status: "Active",
      }),
    ).toEqual({
      data: {
        name: "Glow Serum",
        slug: "glow-serum",
        category: "Skincare",
        description: "Updated product description",
        price: 89,
        stock: 12,
        low_stock_threshold: 5,
        status: "active",
        is_active: true,
        collection: null,
        dimensions: "30 ml bottle",
        weight: null,
      },
    });
  });
});