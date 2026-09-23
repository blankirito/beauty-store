import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import LogOut from "@/components/profile/LogoutButton";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontProfileMenu from "@/components/storefront/StorefrontProfileMenu";
import { createClient } from "@/lib/supabase/server";
import {
  getStorefrontProfileMetrics,
  getStorefrontProfileName,
} from "@/lib/storefront/storefrontProfile";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";

type StorefrontProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontProfilePage({
  params,
}: StorefrontProfilePageProps) {
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
    return (
      <main className="min-h-screen pb-24">
        <StorefrontHeader
          storeName={storefront.name}
          storeSlug={storefront.slug}
        />

        <section className="mx-auto mt-12 max-w-md px-5 text-center">
          <h1 className="font-display text-3xl text-primary">
            Your account at {storefront.name}
          </h1>

          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Sign in to view your orders and account details for this store.
          </p>

          <Link
            href={`/login?store=${encodeURIComponent(storefront.slug)}`}
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </Link>

          <Link
            href={`/store/${storefront.slug}`}
            className="mt-4 block text-sm font-semibold text-primary"
          >
            Continue shopping
          </Link>
        </section>
      </main>
    );
  }

  const [{ data: profile, error: profileError }, { data: orders, error: ordersError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("orders")
        .select("fulfillment_status")
        .eq("store_id", storefront.id)
        .eq("customer_id", user.id),
    ]);

  if (profileError || ordersError) {
    throw new Error("Could not load your store account.");
  }

  const profileName = getStorefrontProfileName(
    profile?.full_name ?? null,
    user.email ?? "Your account",
  );

  const metrics = getStorefrontProfileMetrics(
    (orders ?? []).map((order) => ({
      fulfillmentStatus: order.fulfillment_status,
    })),
  );

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader
        storeName={storefront.name}
        storeSlug={storefront.slug}
      />

      <ProfileHeader name={profileName} />

      <ProfileStats
        orderCount={metrics.orderCount}
        activeOrderCount={metrics.activeOrderCount}
      />

      <StorefrontProfileMenu
        storeName={storefront.name}
        storeSlug={storefront.slug}
      />

      <LogOut storeSlug={storefront.slug} />
    </main>
  );
}
