"use client";

import { products } from "@/data/products";
import { useCart } from "./CartProvider";

function formatCurrency(value: number) {
  return `RM${value.toFixed(2)}`;
}

export default function OrderSummary() {
  const { items, isReady } = useCart();

  const selectedItems = items.filter((item) => item.isSelected);

  const subtotal = selectedItems.reduce((total, item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === item.productId,
    );

    return product ? total + product.price * item.quantity : total;
  }, 0);

  const selectedItemCount = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const shipping = 0;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  if (!isReady) {
    return <section className="mx-5 mt-8 h-56 animate-pulse rounded-xl bg-surface-low" />;
  }

  return (
    <section className="mx-5 mt-8 rounded-xl bg-surface-low p-6">
      <h3 className="mb-5 font-display text-xl font-medium text-primary">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal ({selectedItemCount} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-on-surface-variant">
          <span>Shipping</span>
          <span className="font-semibold text-secondary">FREE</span>
        </div>

        <div className="flex justify-between text-on-surface-variant">
          <span>Taxes (Estimated)</span>
          <span>{formatCurrency(estimatedTax)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-outline pt-4">
          <span className="font-display text-2xl text-foreground">Total</span>

          <span className="text-xl font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </section>
  );
}