"use client";

import {
  BarChart3,
  LayoutDashboard,
  Package,
  ReceiptText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ReceiptText,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-outline/10 bg-surface/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(209,180,140,0.15)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-around px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex h-12 min-w-[56px] flex-col items-center justify-center rounded-xl bg-primary-container/40 px-2 py-1 text-primary"
                  : "flex h-12 min-w-[56px] flex-col items-center justify-center px-2 py-1 text-on-surface-variant transition-colors hover:text-on-surface"
              }
            >
              <Icon size={22} />
              <span className="mt-0.5 text-[10px] font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}