import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import type { StorefrontProduct } from "@/lib/storefront/storefrontProduct";

type StorefrontProductCardProps = {
  storeSlug: string;
  product: StorefrontProduct;
};

export default function StorefrontProductCard({
  storeSlug,
  product,
}: StorefrontProductCardProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const imageUrl =
    supabaseUrl && product.imagePath
      ? getPublicProductImageUrl(supabaseUrl, product.imagePath)
      : null;

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-sm transition hover:shadow-md">
      <Link
        href={`/store/${storeSlug}/product/${product.slug}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-container-low">
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

          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm">
            <Heart size={18} />
          </span>
        </div>

        <div className="p-4">
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
        </div>
      </Link>
    </article>
  );
}
