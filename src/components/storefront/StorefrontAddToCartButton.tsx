"use client";

import { ShoppingBag } from "lucide-react";
import { useStorefrontCart } from "./StorefrontCartProvider";

type StorefrontAddToCartButtonProps = {
  storeSlug: string;
  productId: string;
  stock: number;
};

export default function StorefrontAddToCartButton({
  storeSlug,
  productId,
  stock,
}: StorefrontAddToCartButtonProps) {
  const { addItem } = useStorefrontCart();

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-full bg-outline/40 py-4 text-lg font-semibold text-on-surface-variant"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(storeSlug, productId, 1, stock)}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-semibold text-white shadow-md transition active:scale-[0.98] hover:opacity-90"
    >
      <ShoppingBag size={20} />
      Add to Cart
    </button>
  );
}