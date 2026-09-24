import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontWishlistGrid from "@/components/storefront/StorefrontWishlistGrid";
import { createClient } from "@/lib/supabase/server";
import {
  getCachedPublicStorefront,
  getCachedPublicStorefrontProducts,
} from "@/lib/storefront/publicStorefrontCache";
import { filterStorefrontWishlistProducts } from "@/lib/storefront/filterStorefrontWishlistProducts";

type StorefrontWishlistPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontWishlistPage({
  params,
}: StorefrontWishlistPageProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen pb-24">
        <StorefrontHeader
          storeName={storefront.name}
          storeSlug={storefront.slug}
        />

        <section className="mx-auto mt-12 max-w-md px-5 text-center">
          <h1 className="font-display text-3xl text-primary">
            Your wishlist at {storefront.name}
          </h1>

          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Sign in to view products you have saved for this store.
          </p>

          <Link
            href={`/login?store=${encodeURIComponent(storefront.slug)}`}
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </Link>

          <Link
            href={`/store/${storefront.slug}`}
            className="mt-4 block text-sm font-semibold text-primary"
          >
            Continue shopping
          </Link>
        </section>
      </main>
    );
  }

  const [{ data: wishlistItems, error: wishlistError }, products] =
    await Promise.all([
      supabase
        .from("customer_wishlist_items")
        .select("product_id")
        .eq("user_id", user.id),
      getCachedPublicStorefrontProducts(storefront.id),
    ]);

  if (wishlistError) {
    throw new Error("Could not load your wishlist.");
  }

  const wishlistedProductIds = new Set(
    (wishlistItems ?? []).map((item) => item.product_id),
  );

  const wishlistedProducts = filterStorefrontWishlistProducts(
    products,
    wishlistedProductIds,
  );

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader
        storeName={storefront.name}
        storeSlug={storefront.slug}
      />

      <section className="px-5 pt-9">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary">
          YOUR STORE ACCOUNT
        </p>

        <h1 className="mt-2 font-display text-4xl text-primary">
          Wishlist
        </h1>

        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Products you have saved from {storefront.name}.
        </p>

        <StorefrontWishlistGrid
          storeSlug={storefront.slug}
          products={wishlistedProducts}
        />
      </section>
    </main>
  );
}