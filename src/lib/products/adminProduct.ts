import type { DatabaseProductStatus } from "./productStatus";

type SupabaseProductImage = {
  storage_path: string;
  is_primary: boolean;
};

type SupabaseProductRow = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  status: DatabaseProductStatus;
  is_new: boolean;
  product_images: SupabaseProductImage[];
};

export type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: DatabaseProductStatus;
  isNew: boolean;
  imagePaths: string[];
  primaryImagePath: string | null;
};

export function toAdminProduct(
  row: SupabaseProductRow,
): AdminProduct {
  const primaryImage =
    row.product_images.find((image) => image.is_primary) ??
    row.product_images[0];

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    category: row.category,
    price: row.price,
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold,
    status: row.status,
    isNew: row.is_new,
    imagePaths: row.product_images.map((image) => image.storage_path),
    primaryImagePath: primaryImage?.storage_path ?? null,
  };
}