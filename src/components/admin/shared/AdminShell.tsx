"use client";

import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
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
          onMenuClick={() => setIsMenuOpen(true)}
        />
        {children}
      </div>
    </>
  );
}