import { describe, expect, it } from "vitest";
import { getStorefrontNavigation } from "./storefrontNavigation";

describe("storefront navigation", () => {
  it("keeps every shopper link inside the current store", () => {
    expect(getStorefrontNavigation("boutique-demo-store")).toEqual({
      homeHref: "/store/boutique-demo-store",
      productsHref: "/store/boutique-demo-store#products",
      searchHref: "/store/boutique-demo-store/search",
      ordersHref: "/store/boutique-demo-store/orders",
      cartHref: "/store/boutique-demo-store/cart",
      profileHref: "/store/boutique-demo-store/profile",
    });
  });
});