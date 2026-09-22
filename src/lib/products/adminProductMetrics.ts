import type { AdminProduct } from "./adminProduct";

export type AdminProductMetrics = {
  catalogProductCount: number;
  inStockCount: number;
  lowStockCount: number;
  categoryCount: number;
};

export function getAdminProductMetrics(
  products: AdminProduct[],
): AdminProductMetrics {
  const catalogProducts = products.filter(
    (product) => product.status !== "archived",
  );

  return {
    catalogProductCount: catalogProducts.length,
    inStockCount: catalogProducts.filter(
      (product) => product.stock > product.lowStockThreshold,
    ).length,
    lowStockCount: catalogProducts.filter(
      (product) => product.stock <= product.lowStockThreshold,
    ).length,
    categoryCount: new Set(
      catalogProducts.map((product) => product.category),
    ).size,
  };
}