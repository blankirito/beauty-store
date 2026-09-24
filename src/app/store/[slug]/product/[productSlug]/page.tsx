import { notFound } from "next/navigation";
import StorefrontProductClient from "@/components/storefront/StorefrontProductClient";
import {
  getCachedPublicStorefront,
  getCachedPublicStorefrontProduct,
} from "@/lib/storefront/publicStorefrontCache";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialIsWishlisted = false;

  if (user) {
    const { data, error } = await supabase
      .from("customer_wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (error) {
      throw new Error("Could not load your wishlist.");
    }

    initialIsWishlisted = Boolean(data);
  }

  return (
    <StorefrontProductClient
      storeName={storefront.name}
      storeSlug={storefront.slug}
      product={product}
      initialIsWishlisted={initialIsWishlisted}
    />
  );
}