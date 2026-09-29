import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontProductCard from "@/components/storefront/StorefrontProductCard";
import {
  getCachedPublicStorefront,
  getCachedPublicStorefrontProducts,
} from "@/lib/storefront/publicStorefrontCache";
import { selectNewArrivals } from "@/lib/storefront/selectNewArrivals";
import { createClient } from "@/lib/supabase/server";

type NewArrivalsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewArrivalsPage({
  params,
}: NewArrivalsPageProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const products = await getCachedPublicStorefrontProducts(storefront.id);
  const newArrivals = selectNewArrivals(products, 24);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let wishlistedProductIds = new Set<string>();

  if (user) {
    const { data, error } = await supabase
      .from("customer_wishlist_items")
      .select("product_id")
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Could not load your wishlist.");
    }

    wishlistedProductIds = new Set(
      (data ?? []).map((item) => item.product_id),
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader
        storeName={storefront.name}
        storeSlug={storefront.slug}
      />

      <section className="px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {storefront.name}
        </p>

        <h1 className="mt-2 font-display text-4xl text-primary">
          New Arrivals
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
          Discover the latest products added to this collection.
        </p>

        {newArrivals.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-surface-low p-8 text-center text-on-surface-variant">
            This store has no new products available yet.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <StorefrontProductCard
                key={product.id}
                storeSlug={storefront.slug}
                product={product}
                initialIsWishlisted={wishlistedProductIds.has(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}