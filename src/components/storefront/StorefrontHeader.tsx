"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { getStorefrontNavigation } from "@/lib/storefront/storefrontNavigation";

type StorefrontHeaderProps = {
  storeName: string;
  storeSlug: string;
};

export default function StorefrontHeader({
  storeName,
  storeSlug,
}: StorefrontHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = getStorefrontNavigation(storeSlug);

  const menuItems = [
    {
      name: "Home",
      href: navigation.homeHref,
    },
    {
      name: "Products",
      href: navigation.productsHref,
    },
    {
      name: "Your Account",
      href: navigation.profileHref,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline/40 bg-background px-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-full p-2 text-primary hover:bg-surface-low md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            href={navigation.homeHref}
            className="font-display text-2xl text-primary"
          >
            {storeName}
          </Link>

          <nav className="ml-10 hidden gap-8 md:flex">
            <Link href={navigation.homeHref} className="hover:text-primary">
              Home
            </Link>

            <Link
              href={navigation.productsHref}
              className="flex items-center gap-1 hover:text-primary"
            >
              Products
              <ChevronDown size={16} />
            </Link>

            <Link
              href={navigation.profileHref}
              className="hover:text-primary"
            >
              Your Account
            </Link>
          </nav>
        </div>

        <div className="flex gap-2">
          <Link
            href={navigation.cartHref}
            aria-label="Open cart"
            className="rounded-full p-2 transition hover:bg-surface-low"
          >
            <ShoppingCart size={22} />
          </Link>

          <Link
            href={navigation.profileHref}
            aria-label="Open account"
            className="rounded-full p-2 transition hover:bg-surface-low"
          >
            <User size={22} />
          </Link>
        </div>
      </header>

      {menuOpen && (
        <div className="border-t border-outline bg-surface shadow-md md:hidden">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 transition hover:bg-surface-low"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
