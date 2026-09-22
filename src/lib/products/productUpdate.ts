import type { DatabaseProductStatus } from "./productStatus";
import {
  prepareNewProduct,
  type NewProductFormValues,
} from "./newProduct";

export type ProductUpdateData = {
  sku: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  status: DatabaseProductStatus;
  is_active: boolean;
  collection: string | null;
  dimensions: string | null;
  weight: string | null;
};

type ProductUpdatePreparationResult =
  | { data: ProductUpdateData }
  | { error: string };

export function prepareProductUpdate(
  values: NewProductFormValues,
): ProductUpdatePreparationResult {
  const preparedProduct = prepareNewProduct(values);
  const sourceData = preparedProduct.data;

  if (!sourceData) {
    return {
      error:
        preparedProduct.error ??
        "Please check the product details and try again.",
    };
  }

  return {
    data: {
      sku: sourceData.sku,
      name: sourceData.name,
      slug: sourceData.slug,
      category: sourceData.category,
      description: sourceData.description,
      price: sourceData.price,
      stock: sourceData.stock,
      low_stock_threshold: sourceData.low_stock_threshold,
      status: sourceData.status,
      is_active: sourceData.is_active,
      collection: sourceData.collection,
      dimensions: sourceData.dimensions,
      weight: sourceData.weight,
    },
  };
}