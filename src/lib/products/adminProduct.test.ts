import { describe, expect, it } from "vitest";
import { toAdminProduct } from "./adminProduct";

describe("admin product mapping", () => {
  it("maps detail fields and orders product images for the admin product", () => {
    const product = toAdminProduct({
      id: "8fa5e571-166b-4d02-b23c-44f1d32980b1",
      sku: "SER-001",
      name: "Glow Serum",
      description: "Premium hydrating serum",
      category: "Skincare",
      price: 89,
      stock: 12,
      low_stock_threshold: 5,
      status: "active",
      is_new: true,
      collection: "Radiance Essentials",
      dimensions: "30 ml bottle",
      weight: "120 g",
      features: ["Hydrating", "Lightweight"],
      created_at: "2026-09-21T09:00:00.000Z",
      updated_at: "2026-09-22T10:00:00.000Z",
      product_images: [
        {
          storage_path: "stores/store-1/products/product-1/secondary.webp",
          is_primary: false,
          sort_order: 1,
        },
        {
          storage_path: "stores/store-1/products/product-1/primary.webp",
          is_primary: true,
          sort_order: 0,
        },
      ],
    });

    expect(product).toMatchObject({
      id: "8fa5e571-166b-4d02-b23c-44f1d32980b1",
      sku: "SER-001",
      name: "Glow Serum",
      price: 89,
      stock: 12,
      lowStockThreshold: 5,
      status: "active",
      collection: "Radiance Essentials",
      dimensions: "30 ml bottle",
      weight: "120 g",
      features: ["Hydrating", "Lightweight"],
      createdAt: "2026-09-21T09:00:00.000Z",
      updatedAt: "2026-09-22T10:00:00.000Z",
      imagePaths: [
        "stores/store-1/products/product-1/primary.webp",
        "stores/store-1/products/product-1/secondary.webp",
      ],
      primaryImagePath:
        "stores/store-1/products/product-1/primary.webp",
    });
  });
});