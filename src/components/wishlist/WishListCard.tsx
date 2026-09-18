"use client";

import { X, Star } from "lucide-react";
import Link from "next/link";

type WishListItemProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  onRemove: () => void;
  onAddToCart: () => void;
};

export default function WishListCard({
  id,
  name,
  price,
  image,
  description,
  onRemove,
  onAddToCart,
}: WishListItemProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-outline/30 bg-surface shadow-sm">
      <div className="relative aspect-[4/5]">
        <Link href={`/product/${id}`} className="block h-full">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name} from wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-primary hover:text-on-primary"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/product/${id}`}
            className="min-w-0 text-lg font-medium text-primary hover:underline"
          >
            {name}
          </Link>

          <span className="shrink-0 font-semibold text-primary">
            RM{price.toFixed(2)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-1 text-secondary">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} fill="currentColor" />
          ))}
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}