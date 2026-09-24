import { notFound } from "next/navigation";
import StorefrontHelpCenterPage from "@/components/storefront/StorefrontHelpCenterPage";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";

type StorefrontHelpRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontHelpRoute({
  params,
}: StorefrontHelpRouteProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  return (
    <StorefrontHelpCenterPage
      storeName={storefront.name}
      storeSlug={storefront.slug}
      supportEmail="leechongyu99@gmail.com"
    />
  );
}