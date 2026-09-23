import { notFound } from "next/navigation";
import StorefrontProductClient from "@/components/storefront/StorefrontProductClient";
import {
  getCachedPublicStorefront,
  getCachedPublicStorefrontProduct,
} from "@/lib/storefront/publicStorefrontCache";

type StorefrontProductRouteProps = {
  params: Promise<{
    slug: string;
    productSlug: string;
  }>;
};

export default async function StorefrontProductRoute({
  params,
}: StorefrontProductRouteProps) {
  const { slug, productSlug } = await params;

  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const product = await getCachedPublicStorefrontProduct(
    storefront.id,
    productSlug,
  );

  if (!product) {
    notFound();
  }

  return (
    <StorefrontProductClient
      storeName={storefront.name}
      storeSlug={storefront.slug}
      product={product}
    />
  );
}
