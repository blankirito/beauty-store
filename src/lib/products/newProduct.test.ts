import { describe, expect, it } from "vitest";
import { prepareNewProduct } from "./newProduct";

describe("new product preparation", () => {
    it("creates an insert-ready active product from form values", () => {
        const result = prepareNewProduct({
            name: "  Glow Serum  ",
            sku: "  SER-001  ",
            category: "Skincare",
            description: "Premium hydrating serum",
            price: "89.00",
            stock: "12",
            lowStockThreshold: "5",
            collection: "",
            dimensions: "30 ml bottle",
            weight: "",
            status: "Active",
        });

        expect(result).toEqual({
            data: {
                sku: "SER-001",
                name: "Glow Serum",
                slug: "glow-serum",
                category: "Skincare",
                description: "Premium hydrating serum",
                price: 89,
                stock: 12,
                low_stock_threshold: 5,
                status: "active",
                is_active: true,
                is_new: false,
                features: [],
                rating: 0,
                review_count: 0,
                collection: null,
                dimensions: "30 ml bottle",
                weight: null,
            },
        });
    });
    it("rejects a product without a name or SKU", () => {
        expect(
            prepareNewProduct({
                name: " ",
                sku: " ",
                category: "Skincare",
                description: "",
                price: "89",
                stock: "0",
                lowStockThreshold: "5",
                collection: "",
                dimensions: "",
                weight: "",
                status: "Draft",
            }),
        ).toEqual({
            error: "Product name and SKU are required.",
        });
    });
    it("rejects an empty price or negative inventory value", () => {
        expect(
            prepareNewProduct({
                name: "Glow Serum",
                sku: "SER-001",
                category: "Skincare",
                description: "",
                price: "",
                stock: "-1",
                lowStockThreshold: "5",
                collection: "",
                dimensions: "",
                weight: "",
                status: "Draft",
            }),
        ).toEqual({
            error: "Price, stock, and alert level must be valid values.",
        });
    });
});