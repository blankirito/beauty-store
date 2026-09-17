"use client";

import { Bell, ChevronDown, Menu, User } from "lucide-react";

type AdminHeaderProps = {
  section?: string;
  onMenuClick?: () => void;
};

export default function AdminHeader({
  section = "Admin Portal",
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-outline/20 bg-surface/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl text-on-surface">
                Lumina
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              BoutiqueStore · {section}
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="View notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <Bell size={21} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
            <User size={17} />
          </div>
        </div>
      </div>
    </header>
  );
}