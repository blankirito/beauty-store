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
});