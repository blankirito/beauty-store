"use client";

import { Check, Heart, Share2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import type { StorefrontProduct } from "@/lib/storefront/storefrontProduct";
import { useStorefrontCart } from "./StorefrontCartProvider";
import { toggleStorefrontWishlistItem } from "@/app/store/[slug]/product/[productSlug]/actions";

type StorefrontProductClientProps = {
  storeName: string;
  storeSlug: string;
  product: StorefrontProduct;
  initialIsWishlisted: boolean;
};

export default function StorefrontProductClient({
  storeName,
  storeSlug,
  product,
  initialIsWishlisted,
}: StorefrontProductClientProps) {
  const router = useRouter();
  const { addItem } = useStorefrontCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(
    initialIsWishlisted,
  );
  const [wishlistError, setWishlistError] = useState("");
  const [isUpdatingWishlist, startWishlistTransition] = useTransition();

  const imageUrl =
    product.imagePath && process.env.NEXT_PUBLIC_SUPABASE_URL
      ? getPublicProductImageUrl(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        product.imagePath,
      )
      : null;

  function addToCart() {
    addItem(storeSlug, product.id, quantity, product.stock);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  }

  function buyNow() {
    addItem(storeSlug, product.id, quantity, product.stock);
    router.push(`/store/${storeSlug}/cart`);
  }

  function handleWishlist() {
    setWishlistError("");

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

      if (result.status === "error") {
        setWishlistError(result.message);
        return;
      }

      setIsWishlisted(result.isWishlisted);
    });
  }

  async function shareProduct() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch {
      // The shopper closed the share sheet or browser blocked clipboard access.
    }
  }

  return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-surface/80 px-5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="font-display text-xl text-primary">{storeName}</h1>

        <button
          type="button"
          onClick={() => void shareProduct()}
          aria-label="Share product"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
        >
          <Share2 size={22} />
        </button>
      </header>

      <section className="aspect-[4/5] w-full overflow-hidden bg-surface-low sm:aspect-square">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.imageAlt ?? product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-on-surface-variant">
            Image coming soon
          </div>
        )}
      </section>

      <section className="mt-7 px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-3xl font-medium text-foreground">
              {product.name}
            </h2>

            <span
              className={
                product.stock > 0
                  ? "mt-2 inline-block text-sm font-medium text-green-700"
                  : "mt-2 inline-block text-sm font-medium text-error"
              }
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <p className="font-display text-2xl font-medium text-primary">
              RM{product.price.toFixed(2)}
            </p>

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
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition disabled:cursor-not-allowed ${isWishlisted
                  ? "border-primary bg-primary text-white"
                  : "border-outline/30 bg-surface text-primary hover:bg-surface-low"
                }`}
            >
              <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        {wishlistError && (
          <p
            role="alert"
            className="mt-4 text-sm text-error"
          >
            {wishlistError}
          </p>
        )}
      </section>

      <section className="mt-7 flex items-center justify-between border-y border-surface-low px-5 py-5">
        <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Quantity
        </span>

        <div className="flex items-center rounded-full bg-surface-low px-2 py-1">
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-10 w-10 items-center justify-center text-xl text-primary disabled:text-outline"
          >
            −
          </button>

          <span className="flex h-10 w-10 items-center justify-center font-semibold text-primary">
            {quantity}
          </span>

          <button
            type="button"
            disabled={quantity >= product.stock}
            onClick={() =>
              setQuantity((current) => Math.min(product.stock, current + 1))
            }
            className="flex h-10 w-10 items-center justify-center text-xl text-primary disabled:text-outline"
          >
            +
          </button>
        </div>
      </section>

      <section className="mt-8 px-5">
        <h3 className="mb-3 font-display text-2xl font-medium text-foreground">
          Product Description
        </h3>

        <p className="text-sm leading-relaxed text-on-surface-variant">
          {product.description}
        </p>
      </section>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-center gap-3 border-t border-outline bg-surface px-5 py-4 shadow-lg">
        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={addToCart}
          className={
            isAdded
              ? "flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold uppercase tracking-wider text-white"
              : "flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent text-sm font-bold uppercase tracking-wider text-primary transition hover:bg-primary/5 disabled:border-outline disabled:text-outline"
          }
        >
          {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
          {isAdded ? "Added" : "Add to Cart"}
        </button>

        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={buyNow}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-90 disabled:bg-outline"
        >
          Buy Now
        </button>
      </nav>
    </main>
  );
}
