"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/components/cart/CartProvider";

export default function PlaceOrderButton() {
  const { items, isReady } = useCart();

  const selectedItems = items.filter((item) => item.isSelected);

  const subtotal = selectedItems.reduce((total, item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === item.productId,
    );

    return product ? total + product.price * item.quantity : total;
  }, 0);

  const total = subtotal + subtotal * 0.08;
  const canPlaceOrder = isReady && selectedItems.length > 0;

  return (
    <div className="w-full px-5 py-4">
      {canPlaceOrder ? (
        <Link
          href="/ordersuccess"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
        >
          <ShoppingBag size={20} />
          Place Order · RM{total.toFixed(2)}
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-outline/40 py-4 text-lg font-semibold text-on-surface-variant"
        >
          <ShoppingBag size={20} />
          Select items to continue
        </button>
      )}

      <p className="mt-2 text-center text-xs text-on-surface-variant">
        By placing an order, you agree to our Terms and Conditions.
      </p>
    </div>
  );
}