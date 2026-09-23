"use client";

import {
  ReceiptText,
  Heart,
  MapPin,
  Settings,
  Info,
  ArrowRight,
  CreditCard,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  href?: string;
  action?: "start_store";
};

const menu: MenuItem[] = [
  {
    name: "Start your store",
    icon: Store,
    action: "start_store",
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
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [startingStore, setStartingStore] = useState(false);

  async function handleStartStore() {
    setNotice("");
    setStartingStore(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/merchant/register");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        merchant_intent: true,
      },
    });

    if (error) {
      setStartingStore(false);
      setNotice("We could not start your merchant application. Please try again.");
      return;
    }

    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <section className="space-y-3 px-5">
      {menu.map((menuItem) => {
        const Icon = menuItem.icon;

        const content = (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon size={20} />
              </div>

              <span className="text-lg text-on-surface">
                {startingStore && menuItem.action === "start_store"
                  ? "Starting your store..."
                  : menuItem.name}
              </span>
            </div>

            <ArrowRight size={20} className="text-outline" />
          </>
        );

        const className =
          "flex w-full items-center justify-between rounded-xl bg-surface p-4 shadow-sm transition hover:bg-surface-low active:scale-[0.97]";

        if (menuItem.action === "start_store") {
          return (
            <button
              key={menuItem.name}
              type="button"
              onClick={handleStartStore}
              disabled={startingStore}
              className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {content}
            </button>
          );
        }

        return (
          <Link key={menuItem.name} href={menuItem.href!} className={className}>
            {content}
          </Link>
        );
      })}

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-primary-container/25 px-3 py-3 text-center text-sm text-on-primary-container"
        >
          {notice}
        </p>
      )}
    </section>
  );
}