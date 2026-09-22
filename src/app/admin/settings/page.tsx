import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StoreSettingsMenu from "@/components/admin/settings/StoreSettingsMenu";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-surface px-5 py-6 pb-10">
      <Link
        href="/admin/profile"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
      >
        <ArrowLeft size={17} />
        Admin Profile
      </Link>

      <section className="pb-8 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Administration
        </p>

        <h1 className="mt-2 font-display text-4xl text-on-surface">
          Store Settings
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
          Configure how your store operates for customers and your team.
        </p>
      </section>

      <StoreSettingsMenu />
    </main>
  );
}