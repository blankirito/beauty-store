"use client";

import Link from "next/link";
import WishListCard from "./WishListCard";
import { products } from "@/data/products";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";

export default function WishListList() {
  const { productIds, isReady, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (!isReady) {
    return <section className="px-5 text-on-surface-variant">Loading wishlist...</section>;
  }

  const wishlistProducts = products.filter((product) =>
    productIds.includes(product.id),
  );

  if (wishlistProducts.length === 0) {
    return (
      <section className="px-5 text-center">
        <div className="rounded-2xl bg-surface-low p-8">
          <h2 className="font-display text-2xl text-primary">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-sm text-on-surface-variant">
            Save products you love and return to them anytime.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary"
          >
            Explore products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 px-5">
      {wishlistProducts.map((product) => (
        <WishListCard
          key={product.id}
          {...product}
          onRemove={() => removeItem(product.id)}
          onAddToCart={() => addItem(product.id, 1)}
        />
      ))}
    </section>
  );
}