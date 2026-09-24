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
import { getStorefrontNavigation } from "@/lib/storefront/storefrontNavigation";

type StorefrontProfileMenuProps = {
  storeName: string;
  storeSlug: string;
};

type StorefrontMenuItem = {
  name: string;
  icon: LucideIcon;
  href?: string;
};

export default function StorefrontProfileMenu({
  storeSlug,
}: StorefrontProfileMenuProps) {
  const navigation = getStorefrontNavigation(storeSlug);
  const items: StorefrontMenuItem[] = [
    { name: "Start your store", icon: Store },
    { name: "Orders", icon: ReceiptText, href: navigation.ordersHref },
    {
      name: "Payment Method",
      icon: CreditCard,
      href: `/store/${storeSlug}/payment-method`,
    },
    {
      name: "Wishlist",
      icon: Heart,
      href: `/store/${storeSlug}/wishlist`,
    },
    {
      name: "Saved Addresses",
      icon: MapPin,
      href: `/store/${storeSlug}/saved-addresses`,
    },
    {
      name: "Settings",
      icon: Settings,
      href: `/store/${storeSlug}/settings`,
    },
    {
      name: "Help Center",
      icon: Info,
      href: `/store/${storeSlug}/help`,
    },
  ];

  const className =
    "flex w-full items-center justify-between rounded-xl bg-surface p-4 shadow-sm transition hover:bg-surface-low active:scale-[0.97]";

  return (
    <section className="space-y-3 px-5">
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon size={20} />
              </div>
              <span className="text-lg text-on-surface">{item.name}</span>
            </div>
            <ArrowRight size={20} className="text-outline" />
          </>
        );

        return item.href ? (
          <Link key={item.name} href={item.href} className={className}>
            {content}
          </Link>
        ) : (
          <div key={item.name} className={className} aria-disabled="true">
            {content}
          </div>
        );
      })}
    </section>
  );
}
