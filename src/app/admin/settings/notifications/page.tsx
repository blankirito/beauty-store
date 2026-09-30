import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import NotificationsHistory from "@/components/admin/settings/NotificationsHistory";
import { getAdminNotifications } from "@/lib/admin/getAdminNotifications";
import { groupAdminNotifications } from "@/lib/admin/orderNotifications";

export default async function AdminNotificationsPage() {
  const notifications = await getAdminNotifications({
    limit: undefined,
  });

  const groupedNotifications = groupAdminNotifications(notifications);

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
          Store activity
        </p>

        <h1 className="mt-2 font-display text-4xl text-on-surface">
          Notifications
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
          Keep track of new orders and important activity in your store.
        </p>
      </section>

      <NotificationsHistory notifications={groupedNotifications} />
    </main>
  );
}