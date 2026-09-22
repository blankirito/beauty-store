import { describe, expect, it } from "vitest";
import {
    addStorefrontCartItem,
    type StorefrontCartLine,
    updateStorefrontCartQuantity,
    addStorefrontCartItemWithinStock,
} from "./storefrontCart";

describe("storefront cart", () => {
    it("adds a real product to the current store cart", () => {
        const items = addStorefrontCartItem([], {
            storeSlug: "boutique-demo-store",
            productId: "product-uuid-1",
            quantity: 2,
        });

        expect(items).toEqual([
            {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 2,
                isSelected: true,
            },
        ]);
    });

    it("increases quantity only for the same product in the same store", () => {
        const existingItems: StorefrontCartLine[] = [
            {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 1,
                isSelected: true,
            },
        ];

        expect(
            addStorefrontCartItem(existingItems, {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 2,
            }),
        ).toEqual([
            {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 3,
                isSelected: true,
            },
        ]);
    });
    it("removes a storefront cart item when its quantity becomes zero", () => {
        const items: StorefrontCartLine[] = [
            {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 2,
                isSelected: true,
            },
        ];

        expect(
            updateStorefrontCartQuantity(
                items,
                "boutique-demo-store",
                "product-uuid-1",
                0,
            ),
        ).toEqual([]);
    });
    it("never adds more items than the product has in stock", () => {
        const items: StorefrontCartLine[] = [
            {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 1,
                isSelected: true,
            },
        ];

        expect(
            addStorefrontCartItemWithinStock(
                items,
                {
                    storeSlug: "boutique-demo-store",
                    productId: "product-uuid-1",
                    quantity: 5,
                },
                1,
            ),
        ).toEqual([
            {
                storeSlug: "boutique-demo-store",
                productId: "product-uuid-1",
                quantity: 1,
                isSelected: true,
            },
        ]);
    });
});