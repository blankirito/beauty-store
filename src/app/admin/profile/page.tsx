import { ShieldCheck } from "lucide-react";
import AdminProfileMenu from "@/components/admin/profile/AdminProfileMenu";

export default function AdminProfilePage() {
  return (
    <main className="min-h-screen bg-surface px-5 py-7 pb-10">
      <section className="flex flex-col items-center pb-9 pt-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-on-primary">
          <ShieldCheck size={34} />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Store administrator
        </p>

        <h1 className="mt-2 font-display text-4xl text-on-surface">
          Admin Profile
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-on-surface-variant">
          Manage your store workspace and administration settings.
        </p>
      </section>

      <AdminProfileMenu />
    </main>
  );
}