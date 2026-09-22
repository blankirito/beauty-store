import { notFound } from "next/navigation";
import StorefrontCheckoutPage from "@/components/storefront/StorefrontCheckoutPage";
import {
  getPublicStorefront,
  getPublicStorefrontPaymentMethods,
} from "@/lib/storefront/getPublicStorefront";

type StorefrontCheckoutRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function StorefrontCheckoutRoute({
  params,
}: StorefrontCheckoutRouteProps) {
  const { slug } = await params;

  const storefront = await getPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const paymentMethods = await getPublicStorefrontPaymentMethods(
    storefront.slug,
  );

  return (
    <StorefrontCheckoutPage
      storeId={storefront.id}
      storeName={storefront.name}
      storeSlug={storefront.slug}
      paymentMethods={paymentMethods}
    />
  );
}