type NotificationRecipient = {
  userId: string;
  role: "owner" | "admin";
};

type NewOrderNotificationInput = {
  storeId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  recipients: NotificationRecipient[];
};

type DatabaseNotification = {
  id: string;
  order_id: string | null;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  orders:
    | {
        order_number: string;
      }
    | {
        order_number: string;
      }[]
    | null;
};

export type AdminNotification = {
  id: string;
  orderId: string | null;
  orderNumber: string | null;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export function buildNewOrderNotifications({
  storeId,
  orderId,
  orderNumber,
  customerName,
  recipients,
}: NewOrderNotificationInput) {
  const uniqueRecipients = [
    ...new Map(
      recipients.map((recipient) => [
        recipient.userId,
        recipient,
      ]),
    ).values(),
  ];

  return uniqueRecipients.map((recipient) => ({
    store_id: storeId,
    recipient_user_id: recipient.userId,
    order_id: orderId,
    title: `New order ${orderNumber}`,
    body: `${customerName} placed a new order.`,
  }));
}

export function toAdminNotification(
  notification: DatabaseNotification,
): AdminNotification {
  const order = Array.isArray(notification.orders)
    ? notification.orders[0]
    : notification.orders;

  return {
    id: notification.id,
    orderId: notification.order_id,
    orderNumber: order?.order_number ?? null,
    title: notification.title,
    body: notification.body,
    isRead: notification.read_at !== null,
    createdAt: notification.created_at,
  };
}

export function getUnreadNotificationCount(
  notifications: Array<Pick<AdminNotification, "isRead">>,
) {
  return notifications.filter((notification) => !notification.isRead).length;
}

export function groupAdminNotifications(
  notifications: AdminNotification[],
) {
  const sortNewestFirst = (
    left: AdminNotification,
    right: AdminNotification,
  ) =>
    new Date(right.createdAt).getTime() -
    new Date(left.createdAt).getTime();

  return {
    unread: notifications
      .filter((notification) => !notification.isRead)
      .sort(sortNewestFirst),

    read: notifications
      .filter((notification) => notification.isRead)
      .sort(sortNewestFirst),
  };
}

export function getAdminNotificationDestination(
  notification: Pick<AdminNotification, "orderNumber">,
) {
  return notification.orderNumber
    ? `/admin/orders/${notification.orderNumber}`
    : null;
}