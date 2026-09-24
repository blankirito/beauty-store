import Link from "next/link";
import {
  Badge,
  ChevronRight,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { createClient } from "@/lib/supabase/server";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";

type StorefrontSettingsRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorefrontSettingsRoute({
  params,
}: StorefrontSettingsRouteProps) {
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
            Settings
          </h1>

          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Sign in to manage your account settings.
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

  const items = [
    {
      title: "Personal Information",
      description: "Update your name and phone number",
      icon: Badge,
      href: `/store/${storefront.slug}/settings/account`,
    },
    {
      title: "Password",
      description: "Change your account password for better security",
      icon: LockKeyhole,
      href: `/store/${storefront.slug}/settings/password`,
    },
  ];

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader
        storeName={storefront.name}
        storeSlug={storefront.slug}
      />

      <section className="mx-auto max-w-2xl px-5 pt-9">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary">
          YOUR STORE ACCOUNT
        </p>

        <h1 className="mt-2 font-display text-4xl text-primary">
          Settings
        </h1>

        <div className="mt-10">
          <div className="flex items-center gap-3">
            <UserRound size={28} className="text-primary" />

            <h2 className="font-display text-2xl text-primary">
              Account
            </h2>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-outline/20 bg-surface shadow-sm">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-between border-b border-outline/20 p-5 transition last:border-b-0 hover:bg-surface-low"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container/20 text-primary">
                      <Icon size={21} />
                    </div>

                    <div>
                      <p className="font-medium text-on-surface">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm text-on-surface-variant">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={20} className="text-outline" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}