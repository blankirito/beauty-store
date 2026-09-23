import { notFound } from "next/navigation";
import StorefrontSearchClient from "@/components/storefront/StorefrontSearchClient";
import {
  getCachedPublicStorefront,
  getCachedPublicStorefrontProducts,
} from "@/lib/storefront/publicStorefrontCache";

type StorefrontSearchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontSearchPage({
  params,
}: StorefrontSearchPageProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const products = await getCachedPublicStorefrontProducts(storefront.id);

  return (
    <StorefrontSearchClient
      storeName={storefront.name}
      storeSlug={storefront.slug}
      products={products}
    />
  );
}