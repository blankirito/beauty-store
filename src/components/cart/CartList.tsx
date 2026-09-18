"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "./CartProvider";
import CartItem from "./CartItem";

export default function CartList() {
  const {
    items,
    isReady,
    removeItem,
    toggleItem,
    updateQuantity,
  } = useCart();

  if (!isReady) {
    return (
      <section className="mt-6 space-y-4 px-5">
        <div className="h-32 animate-pulse rounded-xl bg-surface-low" />
        <div className="h-32 animate-pulse rounded-xl bg-surface-low" />
      </section>
    );
  }

  const cartProducts = items.flatMap((item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === item.productId,
    );

    return product ? [{ ...product, ...item }] : [];
  });

  if (cartProducts.length === 0) {
    return (
      <section className="mx-5 mt-8 rounded-2xl bg-surface-low p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary">
          <ShoppingBag size={22} />
        </div>

        <h2 className="mt-4 font-display text-2xl text-primary">
          Your cart is empty
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Discover skincare and beauty essentials for your daily ritual.
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-6 space-y-4 px-5">
      {cartProducts.map((item) => (
        <CartItem
          key={item.productId}
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          quantity={item.quantity}
          isSelected={item.isSelected}
          onToggleSelected={() => toggleItem(item.productId)}
          onQuantityChange={(quantity) =>
            updateQuantity(item.productId, quantity)
          }
          onRemove={() => removeItem(item.productId)}
        />
      ))}
    </section>
  );
}