import type { AdminProduct } from "./adminProduct";

export type AdminProductMetrics = {
  inStockCount: number;
  lowStockCount: number;
  categoryCount: number;
};

export function getAdminProductMetrics(
  products: AdminProduct[],
): AdminProductMetrics {
  return {
    inStockCount: products.filter(
      (product) => product.stock > product.lowStockThreshold,
    ).length,
    lowStockCount: products.filter(
      (product) => product.stock <= product.lowStockThreshold,
    ).length,
    categoryCount: new Set(
      products.map((product) => product.category),
    ).size,
  };
}