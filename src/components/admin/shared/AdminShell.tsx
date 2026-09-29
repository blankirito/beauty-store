"use client";

import { useState } from "react";
import type { AdminNotification } from "@/lib/admin/orderNotifications";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  notifications: AdminNotification[];
};

export default function AdminShell({
  children,
  notifications,
}: AdminShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AdminSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <AdminHeader
          section="Admin Portal"
          notifications={notifications}
          onMenuClick={() => setIsMenuOpen(true)}
        />
        {children}
      </div>
    </>
  );
}