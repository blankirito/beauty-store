type ProductImagePathInput = {
  storeId: string;
  productId: string;
  imageId: string;
  extension: string;
};

export function buildProductImagePath({
  storeId,
  productId,
  imageId,
  extension,
}: ProductImagePathInput) {
  return [
    "stores",
    storeId,
    "products",
    productId,
    `${imageId}.${extension}`,
  ].join("/");
}