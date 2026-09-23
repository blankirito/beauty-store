import type { StorefrontProduct } from "./storefrontProduct";

export function filterStorefrontProducts(
  products: StorefrontProduct[],
  query: string,
): StorefrontProduct[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) =>
    [product.name, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}