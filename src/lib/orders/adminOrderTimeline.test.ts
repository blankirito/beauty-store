import { describe, expect, it } from "vitest";
import { toAdminOrderTimeline } from "./adminOrderTimeline";

describe("admin order timeline mapping", () => {
  it("maps order events into displayable timeline entries", () => {
    const timeline = toAdminOrderTimeline([
      {
        title: "Order placed",
        note: "Test order created for the admin order system.",
        fulfillment_status: "new",
        created_at: "2026-09-22T10:00:00.000Z",
      },
    ]);

    expect(timeline).toEqual([
      {
        title: "Order placed",
        note: "Test order created for the admin order system.",
        status: "New",
        createdAt: "2026-09-22T10:00:00.000Z",
      },
    ]);
  });
});