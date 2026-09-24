import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontEmailSettingsPage from "@/components/storefront/StorefrontEmailSettingsPage";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { createClient } from "@/lib/supabase/server";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";

type StorefrontEmailSettingsRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontEmailSettingsRoute({
  params,
}: StorefrontEmailSettingsRouteProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);

  if (!storefront) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return (
      <main className="min-h-screen pb-24">
        <StorefrontHeader
          storeName={storefront.name}
          storeSlug={storefront.slug}
        />

        <section className="mx-auto mt-12 max-w-md px-5 text-center">
          <h1 className="font-display text-3xl text-primary">
            Change Email
          </h1>

          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Sign in to change the email you use for this store.
          </p>

          <Link
            href={`/login?store=${encodeURIComponent(storefront.slug)}`}
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <StorefrontEmailSettingsPage
      storeName={storefront.name}
      storeSlug={storefront.slug}
      currentEmail={user.email}
    />
  );
}