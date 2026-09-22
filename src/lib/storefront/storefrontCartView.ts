import type { StorefrontCartLine } from "./storefrontCart";
import type { StorefrontProduct } from "./storefrontProduct";

export type StorefrontCartViewItem = {
  productId: string;
  quantity: number;
  product: StorefrontProduct;
};

export function toStorefrontCartView(
  cartItems: StorefrontCartLine[],
  products: StorefrontProduct[],
): StorefrontCartViewItem[] {
  return cartItems.flatMap((cartItem) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === cartItem.productId,
    );

    return product
      ? [
          {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            product,
          },
        ]
      : [];
  });
}