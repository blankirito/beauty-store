import { describe, expect, it } from "vitest";
import {
  buildNewOrderNotifications,
  getUnreadNotificationCount,
  toAdminNotification,
} from "./orderNotifications";

describe("order notifications", () => {
  it("creates one notification for each unique owner or admin", () => {
    const notifications = buildNewOrderNotifications({
      storeId: "store-1",
      orderId: "order-1",
      orderNumber: "ORD-001030",
      customerName: "Lee Chongyu",
      recipients: [
        { userId: "owner-1", role: "owner" },
        { userId: "admin-1", role: "admin" },
        { userId: "owner-1", role: "owner" },
      ],
    });

    expect(notifications).toEqual([
      {
        store_id: "store-1",
        recipient_user_id: "owner-1",
        order_id: "order-1",
        title: "New order ORD-001030",
        body: "Lee Chongyu placed a new order.",
      },
      {
        store_id: "store-1",
        recipient_user_id: "admin-1",
        order_id: "order-1",
        title: "New order ORD-001030",
        body: "Lee Chongyu placed a new order.",
      },
    ]);
  });

  it("maps unread and read database notifications for the admin header", () => {
    expect(
      toAdminNotification({
        id: "notification-1",
        order_id: "order-1",
        title: "New order ORD-001030",
        body: "Lee Chongyu placed a new order.",
        read_at: null,
        created_at: "2026-09-29T09:00:00.000Z",
        orders: {
          order_number: "ORD-001030",
        },
      }),
    ).toEqual({
      id: "notification-1",
      orderId: "order-1",
      orderNumber: "ORD-001030",
      title: "New order ORD-001030",
      body: "Lee Chongyu placed a new order.",
      isRead: false,
      createdAt: "2026-09-29T09:00:00.000Z",
    });
  });

  it("counts only unread notifications", () => {
    expect(
      getUnreadNotificationCount([
        { isRead: false },
        { isRead: true },
        { isRead: false },
      ]),
    ).toBe(2);
  });
});