"use client";

import { useCart } from "./CartProvider";

export default function CartHeader() {
  const { items, itemCount, isReady, setAllSelected } = useCart();

  const hasItems = items.length > 0;
  const isAllSelected =
    hasItems && items.every((item) => item.isSelected);

  return (
    <section className="flex items-start justify-between px-5 py-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-foreground">
          Your Cart
        </h2>

        <p className="mt-1 text-sm text-on-surface-variant">
          {!isReady
            ? "Loading your bag..."
            : itemCount === 0
              ? "Your bag is empty"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your bag`}
        </p>
      </div>

      <button
        type="button"
        disabled={!hasItems}
        onClick={() => setAllSelected(!isAllSelected)}
        className={
          hasItems
            ? "text-sm font-semibold text-primary transition hover:opacity-75"
            : "cursor-not-allowed text-sm font-semibold text-outline"
        }
      >
        {isAllSelected ? "Clear Selection" : "Select All"}
      </button>
    </section>
  );
}