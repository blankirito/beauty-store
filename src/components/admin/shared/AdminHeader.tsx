"use client";

import { Bell, ChevronDown, Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { markAdminNotificationRead } from "@/app/admin/notifications/actions";
import {
  getUnreadNotificationCount,
  type AdminNotification,
} from "@/lib/admin/orderNotifications";

type AdminHeaderProps = {
  section?: string;
  notifications: AdminNotification[];
  onMenuClick?: () => void;
};

function formatNotificationDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AdminHeader({
  section = "Admin Portal",
  notifications,
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const unreadCount = getUnreadNotificationCount(notifications);

  function openNotification(notification: AdminNotification) {
    startTransition(async () => {
      if (!notification.isRead) {
        await markAdminNotificationRead(notification.id);
      }

      setIsNotificationsOpen(false);

      if (notification.orderNumber) {
        router.push(`/admin/orders/${notification.orderNumber}`);
      }

      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-outline/20 bg-surface/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl text-on-surface">
                Lumina
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              BoutiqueStore · {section}
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-label={
                unreadCount > 0
                  ? `View notifications, ${unreadCount} unread`
                  : "View notifications"
              }
              aria-expanded={isNotificationsOpen}
              onClick={() =>
                setIsNotificationsOpen((isOpen) => !isOpen)
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <Bell size={21} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-on-primary ring-2 ring-surface">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <section className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-outline/20 bg-surface-container-lowest shadow-xl">
                <div className="border-b border-outline/15 px-4 py-3">
                  <p className="text-sm font-semibold text-on-surface">
                    Notifications
                  </p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "You are all caught up"}
                  </p>
                </div>

                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-on-surface-variant">
                    No notifications yet.
                  </p>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        disabled={isPending}
                        onClick={() => openNotification(notification)}
                        className={
                          notification.isRead
                            ? "w-full border-b border-outline/10 px-4 py-3 text-left transition hover:bg-surface-container disabled:opacity-60"
                            : "w-full border-b border-outline/10 bg-primary-container/20 px-4 py-3 text-left transition hover:bg-primary-container/30 disabled:opacity-60"
                        }
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-on-surface">
                            {notification.title}
                          </p>

                          {!notification.isRead && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                          {notification.body}
                        </p>

                        <p className="mt-1.5 text-[11px] text-on-surface-variant">
                          {formatNotificationDate(notification.createdAt)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          <Link
            href="/admin/profile"
            aria-label="Open admin profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105"
          >
            <User size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}