"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  rating,
  image,
}: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlist();
  const isFavourite = hasItem(id);

  function handleFavouriteClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleItem(id);
  }

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-sm transition hover:shadow-md">
      <div
        className="relative aspect-square overflow-hidden bg-surface-low"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Link
          href={`/product/${id}`}
          aria-label={`View ${name}`}
          className="absolute inset-0"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

        <button
          type="button"
          onClick={handleFavouriteClick}
          aria-label={
            isFavourite
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          aria-pressed={isFavourite}
          className={`
            absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center
            rounded-full bg-white/90 shadow-sm transition
            ${
              isFavourite
                ? "text-primary"
                : "text-on-surface hover:text-primary"
            }
          `}
        >
          <Heart size={18} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      <Link
        href={`/product/${id}`}
        className="block p-4 transition active:opacity-60"
      >
        <div className="flex items-center gap-1 text-sm text-secondary">
          <Star size={14} fill="currentColor" />
          <span>{rating}</span>
        </div>

        <h3 className="mt-1 truncate break-all font-display text-lg font-medium text-primary">
          {name}
        </h3>

        <p className="mt-3 text-lg font-semibold text-primary">
          RM{price.toFixed(2)}
        </p>
      </Link>
    </article>
  );
}