import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontSavedAddressesPage from "@/components/storefront/StorefrontSavedAddressesPage";
import { createClient } from "@/lib/supabase/server";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";
import type { StorefrontSavedAddress } from "@/lib/storefront/storefrontAddresses";

type StorefrontSavedAddressesRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

type CustomerAddressRow = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

export default async function StorefrontSavedAddressesRoute({
  params,
}: StorefrontSavedAddressesRouteProps) {
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
            Your addresses at {storefront.name}
          </h1>

          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Sign in to save delivery addresses and use them at checkout.
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

  const { data, error } = await supabase
    .from("customer_addresses")
    .select(`
      id,
      label,
      recipient_name,
      phone,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      is_default
    `)
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Could not load your saved addresses.");
  }

  const addresses: StorefrontSavedAddress[] = (
    (data ?? []) as CustomerAddressRow[]
  ).map((address) => ({
    id: address.id,
    label: address.label,
    recipientName: address.recipient_name,
    phone: address.phone,
    addressLine1: address.address_line_1,
    addressLine2: address.address_line_2,
    city: address.city,
    state: address.state,
    postalCode: address.postal_code,
    country: address.country,
    isDefault: address.is_default,
  }));

  return (
    <StorefrontSavedAddressesPage
      storeName={storefront.name}
      storeSlug={storefront.slug}
      addresses={addresses}
    />
  );
}