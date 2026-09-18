"use client";

import Link from "next/link";
import OrderItem from "./OrderItem";
import { products } from "@/data/products";
import { useCart } from "@/components/cart/CartProvider";

type OrderSummaryProps = {
  buyNowProductId?: number;
  buyNowQuantity: number;
};

export default function OrderSummary({
  buyNowProductId,
  buyNowQuantity,
}: OrderSummaryProps) {
  const { items, isReady } = useCart();

  const buyNowProduct = products.find(
    (product) => product.id === buyNowProductId,
  );

  const checkoutItems = buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
    : items
        .filter((item) => item.isSelected)
        .map((item) => ({
          product: products.find(
            (product) => product.id === item.productId,
          ),
          quantity: item.quantity,
        }))
        .filter(
          (
            item,
          ): item is {
            product: (typeof products)[number];
            quantity: number;
          } => Boolean(item.product),
        );

  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!buyNowProduct && !isReady) {
    return (
      <section className="w-full rounded-xl border border-outline/30 bg-surface-low p-6">
        <p className="text-sm text-on-surface-variant">
          Loading your order summary...
        </p>
      </section>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <section className="w-full rounded-xl border border-outline/30 bg-surface-low p-6 text-center">
        <h2 className="font-display text-xl text-primary">
          Your checkout is empty
        </h2>

        <Link
          href="/cart"
          className="mt-4 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Return to Cart
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full rounded-xl border border-outline/30 bg-surface-low p-6">
      <h2 className="mb-5 font-display text-lg font-semibold">
        Order Summary
      </h2>

      <div className="mb-6 space-y-4">
        {checkoutItems.map((item) => (
          <OrderItem
            key={item.product.id}
            image={item.product.image}
            title={item.product.name}
            price={item.product.price}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="space-y-3 border-t border-outline/30 pt-5">
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>Subtotal</span>
          <span>RM{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>Shipping</span>
          <span className="font-semibold text-secondary">Free</span>
        </div>

        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>Estimated Tax</span>
          <span>RM{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t border-outline/30 pt-4">
          <span className="font-display text-lg font-semibold">Total</span>

          <span className="text-lg font-bold text-primary">
            RM{total.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}