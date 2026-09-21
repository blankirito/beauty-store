"use client";

import {
  BarChart3,
  LayoutDashboard,
  Package,
  ReceiptText,
  Store,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navigationItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ReceiptText },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

type SidebarContentProps = {
  onNavigate?: () => void;
  showCloseButton?: boolean;
};

function SidebarContent({
  onNavigate,
  showCloseButton = false,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
  <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Store size={21} />
          </div>

          <div>
            <p className="font-display text-xl leading-none text-on-surface">
              Lumina
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Admin Portal
            </p>
          </div>
        </Link>

        {showCloseButton && (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <X size={21} />
          </button>
        )}
      </div>

      <nav className="mt-10 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-primary-container/45 px-3 py-3 text-primary"
                  : "flex items-center gap-3 rounded-xl px-3 py-3 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              }
            >
              <Icon size={20} />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    <AdminLogoutButton onLoggedOut={onNavigate} />
    </div>
  );
}

export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-outline/15 bg-surface-container-low px-4 py-5 lg:flex">
        <SidebarContent />
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-on-surface/30 lg:hidden"
        />
      )}

      <aside
        className={
          isOpen
            ? "fixed inset-y-0 left-0 z-[60] flex w-72 flex-col border-r border-outline/15 bg-surface-container-low px-4 py-5 shadow-2xl transition-transform lg:hidden"
            : "pointer-events-none fixed inset-y-0 left-0 z-[60] flex w-72 -translate-x-full flex-col border-r border-outline/15 bg-surface-container-low px-4 py-5 transition-transform lg:hidden"
        }
      >
        <SidebarContent onNavigate={onClose} showCloseButton />
      </aside>
    </>
  );
}