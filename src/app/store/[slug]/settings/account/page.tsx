import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontAccountSettingsPage from "@/components/storefront/StorefrontAccountSettingsPage";
import { createClient } from "@/lib/supabase/server";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";

type StorefrontAccountSettingsRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontAccountSettingsRoute({
  params,
}: StorefrontAccountSettingsRouteProps) {
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
            Sign in to update your account details.
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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load your account details.");
  }

  return (
    <StorefrontAccountSettingsPage
      storeName={storefront.name}
      storeSlug={storefront.slug}
      fullName={profile?.full_name ?? ""}
      email={user.email ?? ""}
      phone={profile?.phone ?? ""}
    />
  );
}