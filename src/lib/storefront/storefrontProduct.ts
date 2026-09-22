export type DatabaseProductImage = {
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type DatabaseStorefrontProduct = {
  id: string;
  store_id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  review_count: number;
  is_new: boolean;
  product_images: DatabaseProductImage[];
};

export type StorefrontProduct = {
  id: string;
  storeId: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  imagePath: string | null;
  imageAlt: string | null;
};

export function toStorefrontProduct(
  product: DatabaseStorefrontProduct,
): StorefrontProduct {
  const primaryImage =
    product.product_images.find((image) => image.is_primary) ??
    [...product.product_images].sort(
      (firstImage, secondImage) =>
        firstImage.sort_order - secondImage.sort_order,
    )[0];

  return {
    id: product.id,
    storeId: product.store_id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.review_count,
    isNew: product.is_new,
    imagePath: primaryImage?.storage_path ?? null,
    imageAlt: primaryImage?.alt_text ?? null,
  };
}