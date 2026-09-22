import type { DatabaseProductStatus } from "./productStatus";

type SupabaseProductImage = {
  storage_path: string;
  is_primary: boolean;
  sort_order: number;
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
  collection: string | null;
  dimensions: string | null;
  weight: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
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
  collection: string | null;
  dimensions: string | null;
  weight: string | null;
  features: string[];
  createdAt: string;
  updatedAt: string;
  imagePaths: string[];
  primaryImagePath: string | null;
};

export function toAdminProduct(
  row: SupabaseProductRow,
): AdminProduct {
  const images = [...row.product_images].sort(
    (firstImage, secondImage) =>
      firstImage.sort_order - secondImage.sort_order,
  );

  const primaryImage =
    images.find((image) => image.is_primary) ?? images[0];

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
    collection: row.collection,
    dimensions: row.dimensions,
    weight: row.weight,
    features: row.features,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    imagePaths: images.map((image) => image.storage_path),
    primaryImagePath: primaryImage?.storage_path ?? null,
  };
}