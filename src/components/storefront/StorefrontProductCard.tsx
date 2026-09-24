"use client";

import { useState, useTransition } from "react";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleStorefrontWishlistItem } from "@/app/store/[slug]/product/[productSlug]/actions";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import type { StorefrontProduct } from "@/lib/storefront/storefrontProduct";

type StorefrontProductCardProps = {
  storeSlug: string;
  product: StorefrontProduct;
  initialIsWishlisted?: boolean;
  onWishlistChange?: (isWishlisted: boolean) => void;
};

export default function StorefrontProductCard({
  storeSlug,
  product,
  initialIsWishlisted = false,
  onWishlistChange,
}: StorefrontProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isUpdatingWishlist, startWishlistTransition] = useTransition();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const imageUrl =
    supabaseUrl && product.imagePath
      ? getPublicProductImageUrl(supabaseUrl, product.imagePath)
      : null;

  function handleWishlist() {
    startWishlistTransition(async () => {
      const result = await toggleStorefrontWishlistItem({
        storeSlug,
        productSlug: product.slug,
        productId: product.id,
      });

      if (result.status === "requires-sign-in") {
        router.push(`/login?store=${encodeURIComponent(storeSlug)}`);
        return;
      }

      if (result.status === "success") {
        setIsWishlisted(result.isWishlisted);
        onWishlistChange?.(result.isWishlisted);
      }
    });
  }

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
        <Link
          href={`/store/${storeSlug}/product/${product.slug}`}
          className="block h-full"
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.imageAlt ?? product.name}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-on-surface-variant">
              Image coming soon
            </div>
          )}
        </Link>

        <button
          type="button"
          disabled={isUpdatingWishlist}
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition disabled:cursor-not-allowed ${isWishlisted
              ? "bg-primary text-white"
              : "bg-white/90 text-primary hover:bg-white"
            }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <Link
        href={`/store/${storeSlug}/product/${product.slug}`}
        className="block p-4"
      >
        <div className="flex items-center gap-1 text-sm text-secondary">
          <Star size={13} fill="currentColor" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        <h2 className="mt-1 truncate font-display text-lg text-primary">
          {product.name}
        </h2>

        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="text-lg font-semibold text-primary">
            RM {product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </article>
  );
}