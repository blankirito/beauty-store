import { CreditCard, Truck } from "lucide-react";
import type { GuestOrderTracking } from "@/lib/storefront/guestOrderTracking";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import { getStorefrontOrderStatus } from "@/lib/storefront/storefrontOrders";
import {
  formatStorefrontOrderDate,
  formatStorefrontOrderDateTime,
} from "@/lib/storefront/formatStorefrontOrderDate";

type Props = { order: GuestOrderTracking };

function getStatusClass(status: string) {
  if (status === "Pending") return "bg-secondary-container text-on-secondary-container";
  if (status === "Processing") return "bg-primary-container/35 text-on-primary-container";
  if (status === "Shipping") return "bg-primary text-white";
  return "bg-surface-container text-on-surface-variant";
}

function getEventStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "New",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status] ?? null;
}

export default function StorefrontOrderDetail({ order }: Props) {
  const status = getStorefrontOrderStatus(
    order.fulfillmentStatus as "new" | "processing" | "shipped" | "delivered" | "cancelled",
  );
  const steps = order.events.length > 0
    ? order.events
    : [{ title: "Order placed", note: "We received your order.", fulfillmentStatus: "new", createdAt: order.createdAt }];

  return (
    <section className="mx-auto max-w-md space-y-9 px-5 py-8">
      <header className="text-center">
        <h1 className="font-display text-3xl text-on-surface">Order #{order.orderNumber}</h1>
        <div className="mt-3 flex items-center justify-center gap-3">
          <p className="text-sm text-on-surface-variant">
            Placed on {formatStorefrontOrderDate(order.createdAt)}
          </p>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}>{status}</span>
        </div>
      </header>

      <section className="rounded-2xl border border-outline/40 bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="text-xs font-bold tracking-wide text-on-surface">DELIVERY STATUS</h2>
        <div className="mt-7 space-y-5">
          {steps.map((event, index) => (
            <article key={`${event.createdAt}-${index}`} className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-on-surface">{event.title}</p>
                {getEventStatusLabel(event.fulfillmentStatus) && (
                  <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-on-surface">
                    {getEventStatusLabel(event.fulfillmentStatus)}
                  </span>
                )}
              </div>
              {event.note && <p className="mt-1 text-sm text-on-surface-variant">{event.note}</p>}
              <p className="mt-1 text-xs text-outline">
                {formatStorefrontOrderDateTime(event.createdAt)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold tracking-wide text-on-surface">PURCHASED ITEMS ({order.items.length})</h2>
        <div className="mt-5 space-y-5">
          {order.items.map((item, index) => {
            const imageUrl = item.imagePath && process.env.NEXT_PUBLIC_SUPABASE_URL
              ? getPublicProductImageUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, item.imagePath)
              : null;
            return (
              <div key={`${item.name}-${index}`} className="flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : <div className="flex h-full items-center justify-center text-xs text-on-surface-variant">Item</div>}
                </div>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold text-on-surface">{item.name}</p><p className="mt-1 text-sm text-on-surface-variant">Qty: {item.quantity}</p></div>
                <p className="font-semibold text-on-surface">RM{item.lineTotal.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-outline/40 bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="text-xs font-bold tracking-wide text-on-surface">ORDER SUMMARY</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between text-on-surface-variant"><dt>Subtotal</dt><dd className="font-medium text-on-surface">RM{order.subtotal.toFixed(2)}</dd></div>
          <div className="flex justify-between text-on-surface-variant"><dt>Shipping</dt><dd className="font-medium text-on-surface">RM{order.shippingFee.toFixed(2)}</dd></div>
        </dl>
        <div className="mt-6 flex items-end justify-between border-t border-surface-container-highest pt-6"><span className="text-sm font-bold tracking-wide text-on-surface">TOTAL</span><span className="font-display text-2xl text-primary">RM{order.total.toFixed(2)}</span></div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-on-surface"><Truck size={17} />SHIPPING TO</h2>
        <address className="mt-5 space-y-1 not-italic text-sm leading-6 text-on-surface-variant">
          <p className="font-semibold text-on-surface">{order.shippingAddress.recipientName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </address>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-on-surface"><CreditCard size={17} />PAYMENT METHOD</h2>
        <div className="mt-5 flex items-start gap-3"><div className="rounded-lg bg-surface-container p-2 text-on-surface"><CreditCard size={20} /></div><div><p className="font-semibold text-on-surface">{order.paymentMethodLabel}</p><p className="mt-1 text-sm leading-6 text-on-surface-variant">{order.paymentMethodInstructions}</p></div></div>
      </section>
    </section>
  );
}
