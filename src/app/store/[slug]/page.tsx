import { Droplets, Heart, Search, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontProductCard from "@/components/storefront/StorefrontProductCard";
import {
  getCachedPublicStorefront,
  getCachedPublicStorefrontProducts,
} from "@/lib/storefront/publicStorefrontCache";
import { getStorefrontNavigation } from "@/lib/storefront/storefrontNavigation";

type StorefrontPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StorefrontPage({
  params,
}: StorefrontPageProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const products = await getCachedPublicStorefrontProducts(storefront.id);
  const navigation = getStorefrontNavigation(storefront.slug);
  const categories = [...new Set(products.map((product) => product.category))];
  const categoryIcons = [Sparkles, Droplets, WandSparkles, Heart];

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader
        storeName={storefront.name}
        storeSlug={storefront.slug}
      />

      <section className="mt-4 px-4">
        <Link
          href={navigation.searchHref}
          aria-label={`Search ${storefront.name}`}
          className="flex h-12 items-center gap-3 rounded-xl bg-surface-low px-4 transition hover:bg-surface-container"
        >
          <Search size={18} className="text-on-surface-variant" />
          <span className="text-sm text-on-surface-variant">
            Search {storefront.name}...
          </span>
        </Link>
      </section>

      <section className="mt-7 px-4">
        <div
          className="relative h-64 overflow-hidden rounded-xl bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
            <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-[0.2em] backdrop-blur-sm">
              NEW ARRIVALS
            </span>

            <h1 className="mt-3 max-w-sm font-display text-4xl">
              {storefront.name}
            </h1>

            <p className="mt-2 max-w-xs text-sm leading-5 text-white/90">
              {storefront.description || "Discover our latest collection."}
            </p>

            <Link
              href="#products"
              className="mt-5 w-fit rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mt-10">
          <div className="px-4">
            <h2 className="font-display text-2xl text-primary">Categories</h2>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 px-4">
            {categories.slice(0, 5).map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];

              return (
              <a
                key={category}
                href="#products"
                className="group flex min-w-0 flex-col items-center gap-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-low text-on-surface transition group-hover:bg-primary group-hover:text-white">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <span className="min-h-8 text-center text-xs leading-4 text-on-surface-variant">
                  {category}
                </span>
              </a>
              );
            })}
          </div>
        </section>
      )}

      <section id="products" className="mt-10 px-4">
        <h2 className="font-display text-2xl text-primary">
          Recommended For You
        </h2>

        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-surface-low p-8 text-center text-on-surface-variant">
            This store has no products available yet.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <StorefrontProductCard
                key={product.id}
                storeSlug={storefront.slug}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
