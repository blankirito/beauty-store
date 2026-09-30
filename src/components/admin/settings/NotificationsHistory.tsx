"use client";

import { Bell, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { markAdminNotificationRead } from "@/app/admin/notifications/actions";
import {
  getAdminNotificationDestination,
  type AdminNotification,
} from "@/lib/admin/orderNotifications";

type NotificationsHistoryProps = {
  notifications: {
    unread: AdminNotification[];
    read: AdminNotification[];
  };
};

function formatNotificationDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

type NotificationRowProps = {
  notification: AdminNotification;
  onOpen: (notification: AdminNotification) => void;
  isPending: boolean;
};

function NotificationRow({
  notification,
  onOpen,
  isPending,
}: NotificationRowProps) {
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => onOpen(notification)}
      className={
        notification.isRead
          ? "w-full border-b border-outline/10 px-4 py-4 text-left transition hover:bg-surface-container disabled:opacity-60"
          : "w-full border-b border-outline/10 bg-primary-container/20 px-4 py-4 text-left transition hover:bg-primary-container/30 disabled:opacity-60"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface">
            {notification.title}
          </p>

          <p className="mt-1 text-xs leading-5 text-on-surface-variant">
            {notification.body}
          </p>
        </div>

        {!notification.isRead && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-on-surface-variant">
        <span>{formatNotificationDate(notification.createdAt)}</span>

        {notification.orderNumber && (
          <span className="font-semibold text-primary">
            {notification.orderNumber}
          </span>
        )}
      </div>
    </button>
  );
}

export default function NotificationsHistory({
  notifications,
}: NotificationsHistoryProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasNotifications =
    notifications.unread.length > 0 || notifications.read.length > 0;

  function openNotification(notification: AdminNotification) {
    setError(null);

    startTransition(async () => {
      try {
        if (!notification.isRead) {
          await markAdminNotificationRead(notification.id);
        }

        const destination = getAdminNotificationDestination(notification);

        if (destination) {
          router.push(destination);
          return;
        }

        router.refresh();
      } catch {
        setError("We could not update this notification. Please try again.");
      }
    });
  }

  if (!hasNotifications) {
    return (
      <section className="rounded-2xl bg-surface-container-lowest px-5 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/35 text-primary">
          <Bell size={22} />
        </div>

        <p className="mt-4 text-sm font-semibold text-on-surface">
          No notifications yet
        </p>

        <p className="mt-2 text-xs leading-5 text-on-surface-variant">
          New orders and important store activity will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-error-container/40 px-3 py-3 text-sm font-medium text-error"
        >
          {error}
        </p>
      )}

      {isPending && (
        <p
          role="status"
          className="flex items-center gap-2 text-xs text-on-surface-variant"
        >
          <LoaderCircle size={15} className="animate-spin" />
          Updating notification...
        </p>
      )}

      {notifications.unread.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-on-surface">
              Unread
            </h2>

            <span className="rounded-full bg-primary-container/35 px-2 py-1 text-[10px] font-semibold text-on-primary-container">
              {notifications.unread.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
            {notifications.unread.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onOpen={openNotification}
                isPending={isPending}
              />
            ))}
          </div>
        </section>
      )}

      {notifications.read.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Check size={16} className="text-on-surface-variant" />

            <h2 className="text-sm font-semibold text-on-surface">
              Read
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
            {notifications.read.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onOpen={openNotification}
                isPending={isPending}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}