import { notFound } from "next/navigation";
import StorefrontCartPage from "@/components/storefront/StorefrontCartPage";
import { getPublicStorefront } from "@/lib/storefront/getPublicStorefront";

type StorefrontCartRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function StorefrontCartRoute({
  params,
}: StorefrontCartRouteProps) {
  const { slug } = await params;
  const storefront = await getPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  return (
    <StorefrontCartPage
      storeId={storefront.id}
      storeName={storefront.name}
      storeSlug={storefront.slug}
    />
  );
}