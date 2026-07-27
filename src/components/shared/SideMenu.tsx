"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type MenuLink = {
  id: string;
  title: string;
  href: string;
};

type MenuGroup = {
  id: string;
  title: string;
  children: MenuLink[];
};

type MenuItem = MenuLink | MenuGroup;

const menuItems: MenuItem[] = [
  {
    id: "home",
    title: "Home",
    href: "/",
  },
  {
    id: "products",
    title: "Products",
    children: [
      {
        id: "skincare",
        title: "Skincare",
        href: "/products/skincare",
      },
      {
        id: "makeup",
        title: "Makeup",
        href: "/products/makeup",
      },
      {
        id: "haircare",
        title: "Haircare",
        href: "/products/haircare",
      },
    ],
  },
  {
    id: "profile",
    title: "Your Account",
    children: [
      {
        id: "profile",
        title: "Account",
        href: "/profile",
      },
      {
        id: "signin",
        title: "Sign In",
        href: "/login",
      },
    ],
  },
];

export default function SideMenu({ open, onClose }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 z-40
          transition-opacity duration-300
          ${
            open
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0
          h-screen w-72
          bg-surface shadow-xl z-50
          transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-outline">
          <h2 className="font-display text-2xl text-primary">
            Boutique
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-primary hover:bg-surface-low"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => {
            // Normal Link
            if ("href" in item) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="
                    block
                    p-3
                    rounded-lg
                    hover:bg-surface-low
                    active:bg-surface-low
                    active:scale-[0.98]
                    transition
                  "
                >
                  {item.title}
                </Link>
              );
            }

            // Dropdown
            const isOpen = openMenu === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() =>
                    setOpenMenu(isOpen ? null : item.id)
                  }
                  className="
                        w-full
                        flex
                        justify-between
                        items-center
                        p-3
                        rounded-lg
                        hover:bg-surface-low
                        active:bg-surface-low
                        active:scale-[0.98]
                        transition
                  "
                >
                  <span>{item.title}</span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-5 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        onClick={onClose}
                        className="
                            block
                            py-2
                            px-3
                            rounded-lg
                            text-sm
                            hover:bg-surface-low
                            hover:text-primary
                            active:bg-surface-low
                            active:scale-[0.98]
                            transition
                        "
                      >
                        <span>{child.title}</span>
                        {/* <ChevronRight size={16} /> */}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
