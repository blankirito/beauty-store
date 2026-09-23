import { notFound } from "next/navigation";
import StorefrontNavbar from "@/components/storefront/StorefrontNavbar";
import StorefrontOrderDetail from "@/components/storefront/StorefrontOrderDetail";
import { getCustomerStorefrontOrderTracking } from "@/lib/storefront/getCustomerStorefrontOrderTracking";
import { getGuestOrderTracking } from "@/lib/storefront/getGuestOrderTracking";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";
import { createClient } from "@/lib/supabase/server";

type StorefrontOrderPageProps = {
  params: Promise<{ slug: string; orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function StorefrontOrderPage({ params, searchParams }: StorefrontOrderPageProps) {
  const { slug, orderNumber } = await params;
  const { token } = await searchParams;
  const storefront = await getCachedPublicStorefront(slug);
  if (!storefront) notFound();

  const order = token
    ? await getGuestOrderTracking(storefront.slug, orderNumber, token)
    : await (async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        return user ? getCustomerStorefrontOrderTracking(storefront.id, orderNumber, user.id) : null;
      })();

  if (!order) notFound();

  return (
    <main className="min-h-screen pb-24">
      <StorefrontNavbar storeName={storefront.name} homeHref={`/store/${storefront.slug}`} />
      <StorefrontOrderDetail order={order} />
    </main>
  );
}
