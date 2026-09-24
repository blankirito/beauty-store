"use client";

import { useState } from "react";
import Link from "next/link";
import StorefrontProductCard from "@/components/storefront/StorefrontProductCard";
import type { StorefrontProduct } from "@/lib/storefront/storefrontProduct";

type StorefrontWishlistGridProps = {
  storeSlug: string;
  products: StorefrontProduct[];
};

export default function StorefrontWishlistGrid({
  storeSlug,
  products,
}: StorefrontWishlistGridProps) {
  const [wishlistedProducts, setWishlistedProducts] = useState(products);

  if (wishlistedProducts.length === 0) {
    return (
      <div className="mt-8 rounded-2xl bg-surface-low p-8 text-center">
        <h2 className="font-display text-2xl text-primary">
          Your wishlist is empty
        </h2>

        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Save products you love and they will appear here.
        </p>

        <Link
          href={`/store/${storeSlug}`}
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {wishlistedProducts.map((product) => (
        <StorefrontProductCard
          key={product.id}
          storeSlug={storeSlug}
          product={product}
          initialIsWishlisted
          onWishlistChange={(isWishlisted) => {
            if (!isWishlisted) {
              setWishlistedProducts((current) =>
                current.filter((item) => item.id !== product.id),
              );
            }
          }}
        />
      ))}
    </div>
  );
}