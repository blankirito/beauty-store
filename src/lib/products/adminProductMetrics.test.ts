import { describe, expect, it } from "vitest";
import { getAdminProductMetrics } from "./adminProductMetrics";

describe("admin product metrics", () => {
  it("counts in-stock and low-stock products from real inventory values", () => {
    const metrics = getAdminProductMetrics([
      {
        id: "product-1",
        sku: "SER-001",
        name: "Glow Serum",
        description: "Hydrating serum",
        category: "Skincare",
        price: 89,
        stock: 12,
        lowStockThreshold: 5,
        status: "active",
        isNew: false,
        imagePaths: [],
        primaryImagePath: null,
      },
      {
        id: "product-2",
        sku: "CRE-001",
        name: "Face Cream",
        description: "Daily face cream",
        category: "Skincare",
        price: 65,
        stock: 5,
        lowStockThreshold: 5,
        status: "active",
        isNew: false,
        imagePaths: [],
        primaryImagePath: null,
      },
      {
        id: "product-3",
        sku: "LIP-001",
        name: "Velvet Lipstick",
        description: "Matte lipstick",
        category: "Makeup",
        price: 29,
        stock: 0,
        lowStockThreshold: 3,
        status: "draft",
        isNew: true,
        imagePaths: [],
        primaryImagePath: null,
      },
    ]);

    expect(metrics).toEqual({
      inStockCount: 1,
      lowStockCount: 2,
      categoryCount: 2,
    });
  });
});