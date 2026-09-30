import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import StoreProfileEditor from "@/components/admin/settings/StoreProfileEditor";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { createClient } from "@/lib/supabase/server";

export default async function AdminStoreProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"]);

  if (membershipError) {
    throw new Error("Could not load your store access.");
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    redirect("/admin");
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("name, slug, description")
    .eq("id", storeId)
    .maybeSingle();

  if (storeError) {
    throw new Error("Could not load your store profile.");
  }

  if (!store) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-6 pb-10">
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
      >
        <ArrowLeft size={17} />
        Store Settings
      </Link>

      <section className="pb-8 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Storefront
        </p>

        <h1 className="mt-2 font-display text-4xl text-on-surface">
          Store Profile
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
          Update the public name, link, and description customers see.
        </p>
      </section>

      <StoreProfileEditor
        initialProfile={{
          name: store.name,
          slug: store.slug,
          description: store.description,
        }}
      />
    </main>
  );
}