import {
  ArrowRight,
  Bell,
  Clock3,
  CreditCard,
  Store,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getStoreSettingsMenuItems } from "@/lib/admin/adminSettingsNavigation";

const icons = {
  "Store Profile": Store,
  "Payment Methods": CreditCard,
  "Team & Permissions": Users,
  "Delivery & Shipping": Truck,
  Notifications: Bell,
};

export default function StoreSettingsMenu() {
  const items = getStoreSettingsMenuItems();

  return (
    <section className="space-y-3">
      {items.map((item) => {
        const Icon = icons[item.label as keyof typeof icons];
        const isAvailable = item.availability === "available";

        const content = (
          <>
            <div className="flex items-center gap-3">
              <div
                className={
                  isAvailable
                    ? "flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/35 text-primary"
                    : "flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant"
                }
              >
                <Icon size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {item.label}
                </p>

                {!isAvailable && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-variant">
                    <Clock3 size={12} />
                    Coming soon
                  </p>
                )}
              </div>
            </div>

            {isAvailable && (
              <ArrowRight size={19} className="text-on-surface-variant" />
            )}
          </>
        );

        if (!isAvailable) {
          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 opacity-70 shadow-sm"
            >
              {content}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm transition hover:bg-surface-container-low active:scale-[0.99]"
          >
            {content}
          </Link>
        );
      })}
    </section>
  );
}