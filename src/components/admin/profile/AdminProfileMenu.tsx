import { ArrowRight, CircleHelp, Settings } from "lucide-react";
import Link from "next/link";
import { getAdminProfileMenuItems } from "@/lib/admin/adminSettingsNavigation";

const icons = {
  "Store Settings": Settings,
  "Help Center": CircleHelp,
};

export default function AdminProfileMenu() {
  const items = getAdminProfileMenuItems();

  return (
    <section className="space-y-3">
      {items.map((item) => {
        const Icon = icons[item.label as keyof typeof icons];

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm transition hover:bg-surface-container-low active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/35 text-primary">
                <Icon size={21} />
              </div>

              <span className="text-sm font-semibold text-on-surface">
                {item.label}
              </span>
            </div>

            <ArrowRight size={19} className="text-on-surface-variant" />
          </Link>
        );
      })}
    </section>
  );
}