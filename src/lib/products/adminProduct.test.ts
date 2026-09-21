import { describe, expect, it } from "vitest";
import { toAdminProduct } from "./adminProduct";

describe("admin product mapping", () => {
  it("maps a Supabase product row into the admin product format", () => {
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
      product_images: [
        {
          storage_path: "stores/store-1/products/product-1/glow-serum.webp",
          is_primary: true,
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
      primaryImagePath:
        "stores/store-1/products/product-1/glow-serum.webp",
    });
  });
});