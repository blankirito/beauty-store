import { describe, expect, it } from "vitest";
import { getPublicProductImageUrl } from "./productImageUrl";

describe("public product image URL", () => {
  it("builds the public URL for a stored product image", () => {
    expect(
      getPublicProductImageUrl(
        "https://example-project.supabase.co",
        "stores/store-123/products/product-456/image-789.webp",
      ),
    ).toBe(
      "https://example-project.supabase.co/storage/v1/object/public/product-images/stores/store-123/products/product-456/image-789.webp",
    );
  });
});