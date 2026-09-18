"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

type ProductInfoProps = {
  id: number;
  name: string;
  price: number;
};

export default function ProductInfo({
  id,
  name,
  price,
}: ProductInfoProps) {
  const { hasItem, toggleItem } = useWishlist();
  const isFavourite = hasItem(id);

  return (
    <section className="mt-6 px-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium text-foreground">
            {name}
          </h1>

          <span className="mt-2 inline-block text-sm font-medium text-green-700">
            In Stock
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <p className="font-display text-2xl font-medium text-primary">
            RM{price.toFixed(2)}
          </p>

          <button
            type="button"
            onClick={() => toggleItem(id)}
            aria-label={
              isFavourite
                ? `Remove ${name} from wishlist`
                : `Add ${name} to wishlist`
            }
            aria-pressed={isFavourite}
            className={`
              flex h-10 w-10 items-center justify-center rounded-full
              border transition
              ${
                isFavourite
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline/30 bg-surface text-primary hover:bg-surface-low"
              }
            `}
          >
            <Heart size={19} fill={isFavourite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </section>
  );
}