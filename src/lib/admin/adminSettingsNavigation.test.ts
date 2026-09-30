import { describe, expect, it } from "vitest";
import {
  getAdminProfileMenuItems,
  getStoreSettingsMenuItems,
} from "./adminSettingsNavigation";

describe("admin settings navigation", () => {
  it("keeps the admin profile focused on store work", () => {
    expect(getAdminProfileMenuItems()).toEqual([
      {
        label: "Store Settings",
        href: "/admin/settings",
        availability: "available",
      },
      {
        label: "Help Center",
        href: "/helpcenter",
        availability: "available",
      },
    ]);
  });

  it("links payment methods from the store settings hub", () => {
    expect(getStoreSettingsMenuItems()).toContainEqual({
      label: "Payment Methods",
      href: "/admin/settings/payments",
      availability: "available",
    });
  });
  it("keeps the agreed launch settings menu", () => {
    expect(getStoreSettingsMenuItems()).toEqual([
      {
        label: "Store Profile",
        href: "/admin/settings/profile",
        availability: "available",
      },
      {
        label: "Payment Methods",
        href: "/admin/settings/payments",
        availability: "available",
      },
      {
        label: "Team & Permissions",
        href: "/admin/settings",
        availability: "coming_soon",
      },
      {
        label: "Delivery & Shipping",
        href: "/admin/settings",
        availability: "coming_soon",
      },
      {
        label: "Notifications",
        href: "/admin/settings/notifications",
        availability: "available",
      },
    ]);
  });
});