"use client";

import {
  ArrowRight,
  CreditCard,
  Heart,
  Info,
  MapPin,
  ReceiptText,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const menu: MenuItem[] = [
  {
    name: "Start your store",
    icon: Store,
    href: "/merchant/register",
  },
  {
    name: "Orders",
    icon: ReceiptText,
    href: "/orders",
  },
  {
    name: "Payment Method",
    icon: CreditCard,
    href: "/paymentmethod",
  },
  {
    name: "Wishlist",
    icon: Heart,
    href: "/wishlist",
  },
  {
    name: "Saved Addresses",
    icon: MapPin,
    href: "/savedaddress",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    name: "Help Center",
    icon: Info,
    href: "/helpcenter",
  },
];

export default function ProfileMenu() {
  const className =
    "flex w-full items-center justify-between rounded-xl bg-surface p-4 shadow-sm transition hover:bg-surface-low active:scale-[0.97]";

  return (
    <section className="space-y-3 px-5">
      {menu.map((menuItem) => {
        const Icon = menuItem.icon;

        return (
          <Link key={menuItem.name} href={menuItem.href} className={className}>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon size={20} />
              </div>

              <span className="text-lg text-on-surface">{menuItem.name}</span>
            </div>

            <ArrowRight size={20} className="text-outline" />
          </Link>
        );
      })}
    </section>
  );
}