import { CreditCard, MapPin } from "lucide-react";
import type { GuestOrderTracking } from "@/lib/storefront/guestOrderTracking";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import { getStorefrontOrderStatus } from "@/lib/storefront/storefrontOrders";

type Props = { order: GuestOrderTracking };

function getStatusClass(status: string) {
  if (status === "Pending") return "bg-secondary-container text-on-secondary-container";
  if (status === "Processing") return "bg-primary-container/35 text-on-primary-container";
  if (status === "Shipping") return "bg-primary text-white";
  return "bg-surface-container text-on-surface-variant";
}

export default function StorefrontOrderDetail({ order }: Props) {
  const status = getStorefrontOrderStatus(order.fulfillmentStatus as "new" | "processing" | "shipped" | "delivered" | "cancelled");
  const steps = order.events.length > 0 ? order.events : [{ title: "Order placed", note: "We received your order.", createdAt: order.createdAt }];

  return (
    <section className="mx-auto max-w-md space-y-5 px-5 py-8">
      <section className="rounded-3xl border border-secondary/30 bg-surface-container-lowest p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary">ORDER TRACKING</p>
        <h1 className="mt-3 font-display text-4xl text-on-surface">{order.orderNumber}</h1>
        <p className="mt-3 text-sm text-on-surface-variant">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(status)}`}>{status}</span>
          <span className="rounded-full bg-primary-container/35 px-3 py-1 text-sm font-semibold text-on-primary-container">Payment: {order.paymentStatus}</span>
        </div>
      </section>

      <section className="rounded-3xl border border-secondary/30 bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="font-display text-3xl text-on-surface">Delivery updates</h2>
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">
          {order.trackingNumber ? `${order.trackingCarrier ?? "Carrier"}: ${order.trackingNumber}` : "Your store will add tracking details once the order is shipped."}
        </p>
        <div className="mt-6 space-y-6 border-l-2 border-surface-container-highest pl-5">
          {steps.map((event, index) => <div key={`${event.createdAt}-${index}`}>
            <p className="font-semibold text-on-surface">{event.title}</p>
            {event.note && <p className="mt-1 text-sm text-on-surface-variant">{event.note}</p>}
            <p className="mt-1 text-xs text-outline">{new Date(event.createdAt).toLocaleString()}</p>
          </div>)}
        </div>
      </section>

      <section className="rounded-3xl bg-surface-container p-6">
        <h2 className="font-display text-3xl text-on-surface">Your items</h2>
        <div className="mt-5 divide-y divide-surface-container-highest">
          {order.items.map((item, index) => {
            const imageUrl = item.imagePath && process.env.NEXT_PUBLIC_SUPABASE_URL ? getPublicProductImageUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, item.imagePath) : null;
            return <div key={`${item.name}-${index}`} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container">
                {imageUrl ? <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[10px] text-on-surface-variant">Item</div>}
              </div>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold text-on-surface">{item.name}</p><p className="mt-1 text-sm text-on-surface-variant">Qty: {item.quantity}</p></div>
              <p className="font-semibold text-on-surface">RM{item.lineTotal.toFixed(2)}</p>
            </div>;
          })}
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-surface-container-highest pt-5"><span className="font-display text-3xl text-on-surface">Total</span><span className="font-display text-3xl text-primary">RM{order.total.toFixed(2)}</span></div>
      </section>

      <section className="rounded-3xl border border-secondary/30 bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="font-display text-3xl text-on-surface">Payment</h2>
        <div className="mt-5 flex items-start gap-3"><div className="rounded-lg bg-surface-container p-2"><CreditCard size={22} /></div><div><p className="font-semibold text-on-surface">{order.paymentMethodLabel}</p><p className="mt-1 text-sm leading-6 text-on-surface-variant">{order.paymentMethodInstructions}</p></div></div>
      </section>

      <section className="rounded-3xl border border-secondary/30 bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-2xl text-on-surface"><MapPin size={21} />Delivery address</h2>
        <address className="mt-4 space-y-1 not-italic text-sm leading-6 text-on-surface-variant"><p className="font-semibold text-on-surface">{order.shippingAddress.recipientName}</p><p>{order.shippingAddress.addressLine1}</p>{order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}<p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p><p>{order.shippingAddress.country}</p></address>
      </section>
    </section>
  );
}
