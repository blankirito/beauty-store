import type { StorefrontProduct } from "./storefrontProduct";

export function selectNewArrivals(
  products: StorefrontProduct[],
  limit: number,
): StorefrontProduct[] {
  return products.slice(0, limit);
}