import type { StorefrontProduct } from "./storefrontProduct";

export function filterStorefrontWishlistProducts(
  products: StorefrontProduct[],
  wishlistedProductIds: Set<string>,
): StorefrontProduct[] {
  return products.filter((product) => wishlistedProductIds.has(product.id));
}