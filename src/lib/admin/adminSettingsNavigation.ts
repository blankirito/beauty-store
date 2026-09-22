export type AdminNavigationItem = {
  label: string;
  href: string;
  availability: "available" | "coming_soon";
};

export function getAdminProfileMenuItems(): AdminNavigationItem[] {
  return [
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
  ];
}

export function getStoreSettingsMenuItems(): AdminNavigationItem[] {
  return [
    {
      label: "Store Profile",
      href: "/admin/settings",
      availability: "coming_soon",
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
      href: "/admin/settings",
      availability: "coming_soon",
    },
  ];
}