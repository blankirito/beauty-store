import Link from "next/link";
import { Settings2, Store } from "lucide-react";
import { getAdminStoreContext } from "@/lib/admin/getAdminStoreContext";

export default async function AdminOwnerCard() {
  const context = await getAdminStoreContext();

  if (!context) {
    return null;
  }

  return (
    <section className="flex items-center justify-between rounded-2xl border border-outline/15 bg-surface-container p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-inner">
          <Store size={18} />
        </div>

        <div>
          <h2 className="text-xs font-semibold text-on-surface">
            {context.storeName}
          </h2>

          <p className="text-[10px] font-medium text-on-surface-variant">
            {context.memberName} · {context.roleLabel}
          </p>
        </div>
      </div>

      <Link
        href="/admin/settings"
        aria-label="Open store settings"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline/20 bg-surface-container-lowest text-on-surface-variant transition-colors hover:bg-surface"
      >
        <Settings2 size={17} />
      </Link>
    </section>
  );
}