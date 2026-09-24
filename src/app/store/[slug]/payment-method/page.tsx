import { notFound, redirect } from "next/navigation";
import StorefrontPaymentMethodPage from "@/components/storefront/StorefrontPaymentMethodPage";
import { createClient } from "@/lib/supabase/server";
import {
  getPublicStorefrontPaymentMethods,
} from "@/lib/storefront/getPublicStorefront";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";

type StorefrontPaymentMethodRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function StorefrontPaymentMethodRoute({
  params,
}: StorefrontPaymentMethodRouteProps) {
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
    redirect(`/login?store=${encodeURIComponent(storefront.slug)}`);
  }

  const [paymentMethods, preferenceResult] = await Promise.all([
    getPublicStorefrontPaymentMethods(storefront.slug),
    supabase
      .from("customer_store_payment_preferences")
      .select("payment_method_id")
      .eq("user_id", user.id)
      .eq("store_id", storefront.id)
      .maybeSingle(),
  ]);

  if (preferenceResult.error) {
    throw new Error("Could not load your payment preference.");
  }

  const savedPaymentMethodId = preferenceResult.data?.payment_method_id ?? null;

  const initialPaymentMethodId =
    savedPaymentMethodId &&
    paymentMethods.some((method) => method.id === savedPaymentMethodId)
      ? savedPaymentMethodId
      : paymentMethods[0]?.id ?? "";

  return (
    <StorefrontPaymentMethodPage
      storeName={storefront.name}
      storeSlug={storefront.slug}
      storeId={storefront.id}
      paymentMethods={paymentMethods}
      initialPaymentMethodId={initialPaymentMethodId}
    />
  );
}