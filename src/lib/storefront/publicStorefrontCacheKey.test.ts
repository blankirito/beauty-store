import { describe, expect, it } from "vitest";
import { getPublicStorefrontCacheKey } from "./publicStorefrontCacheKey";

describe("public storefront cache key", () => {
  it("keeps cache entries isolated by a normalized store slug", () => {
    expect(getPublicStorefrontCacheKey(" Boutique-Demo-Store ")).toBe(
      "public-storefront:boutique-demo-store",
    );
    expect(getPublicStorefrontCacheKey("another-store")).toBe(
      "public-storefront:another-store",
    );
  });
});
