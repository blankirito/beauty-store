import Link from "next/link";
import { ChevronRight, Truck } from "lucide-react";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import type { StorefrontOrderViewInput } from "@/lib/storefront/storefrontOrderView";
import { toStorefrontOrderView } from "@/lib/storefront/storefrontOrderView";
import { formatStorefrontOrderDate } from "@/lib/storefront/formatStorefrontOrderDate";

type StorefrontOrderCardProps = {
  order: StorefrontOrderViewInput;
  storeSlug: string;
};

function getStatusClass(status: string) {
  if (status === "Pending") return "bg-secondary-container text-on-secondary-container";
  if (status === "Processing") return "bg-primary-container/35 text-on-primary-container";
  if (status === "Shipping") return "bg-primary text-white";
  return "bg-surface-container text-on-surface-variant";
}

export default function StorefrontOrderCard({
  order,
  storeSlug,
}: StorefrontOrderCardProps) {
  const view = toStorefrontOrderView(order);
  const detailHref = `/store/${storeSlug}/orders/${view.orderNumber}`;
  const imageUrl =
    view.firstItem?.imagePath && process.env.NEXT_PUBLIC_SUPABASE_URL
      ? getPublicProductImageUrl(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          view.firstItem.imagePath,
        )
      : null;

  return (
    <article className="space-y-4 rounded-xl bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Order #{view.orderNumber}
          </p>
          <p className="mt-1 text-sm text-outline">
            Placed on {formatStorefrontOrderDate(view.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(view.status)}`}>
          {view.status}
        </span>
      </div>

      <Link href={detailHref} className="flex items-center gap-4 rounded-lg transition active:opacity-70">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-low">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={view.firstItem?.name ?? "Order item"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-on-surface-variant">Image coming soon</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-medium text-primary">
            {view.firstItem?.name ?? "Order items"}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">{view.itemSummary}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">RM{view.total.toFixed(2)}</p>
          <ChevronRight size={18} className="ml-auto mt-1 text-outline" />
        </div>
      </Link>

      <div className="flex gap-3 border-t border-outline/60 pt-4">
        {view.canTrack && (
          <Link href={detailHref} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90">
            <Truck size={18} />
            Track Order
          </Link>
        )}
        <Link href={detailHref} className={view.canTrack ? "flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5" : "flex flex-1 items-center justify-center rounded-xl border-2 border-primary py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"}>
          View Details
        </Link>
      </div>
    </article>
  );
}
