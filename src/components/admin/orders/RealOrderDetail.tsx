import {
    ArrowLeft,
    CreditCard,
    MapPin,
    Package,
    Truck,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import type { AdminOrder } from "@/lib/orders/adminOrder";
import type { AdminOrderDetail } from "@/lib/orders/adminOrderDetail";
import type { AdminOrderTimelineEntry } from "@/lib/orders/adminOrderTimeline";
import FulfillmentActionButton from "./FulfillmentActionButton";
import ShipmentForm from "./ShipmentForm";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";

type RealOrderDetailProps = {
    order: AdminOrder;
    detail: AdminOrderDetail;
    timeline: AdminOrderTimelineEntry[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
    }).format(value);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-MY", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

function getStatusClass(status: AdminOrder["status"]) {
    if (status === "New" || status === "Cancelled") {
        return "bg-error-container text-error";
    }

    if (status === "Processing") {
        return "bg-secondary-container text-on-secondary-container";
    }

    return "bg-primary-container/40 text-on-primary-container";
}

function OrderItemThumbnail({
  imagePath,
  productName,
}: {
  imagePath: string | null;
  productName: string;
}) {
  const imageUrl =
    imagePath && supabaseUrl
      ? getPublicProductImageUrl(supabaseUrl, imagePath)
      : null;

  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-outline/15 bg-surface-container">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={productName}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-primary">
          <Package size={22} />
        </div>
      )}
    </div>
  );
}

export default function RealOrderDetail({
    order,
    detail,
    timeline,
}: RealOrderDetailProps) {
    const address = detail.shippingAddress;

    return (
        <main className="min-h-screen space-y-5 bg-surface px-5 py-6 pb-10">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
                >
                    <ArrowLeft size={17} />
                    Orders
                </Link>

                <span className="text-xs text-on-surface-variant">
                    Orders / #{order.id}
                </span>
            </div>

            <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="font-display text-3xl text-on-surface">
                            #{order.id}
                        </h1>

                        <p className="mt-2 text-sm text-on-surface-variant">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>

                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
                    >
                        {order.status}
                    </span>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-outline/20 pb-3">
                    <UserRound size={17} className="text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Customer
                    </p>
                </div>

                <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-sm font-bold text-primary">
                        {order.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold text-on-surface">
                            {order.customerName}
                        </h2>
                        <p className="mt-1 truncate text-xs text-on-surface-variant">
                            {order.customerEmail}
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                            {detail.customerPhone ?? "Phone number unavailable"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline/20 pb-3">
                    <div className="flex items-center gap-2">
                        <Package size={17} className="text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            Purchased Items
                        </p>
                    </div>

                    <span className="text-xs text-on-surface-variant">
                        {order.itemCount} items
                    </span>
                </div>

                <div className="divide-y divide-outline/15">
                    {detail.items.map((item) => (
                        <article key={`${item.sku}-${item.productName}`} className="flex gap-3 py-3">
                            <OrderItemThumbnail
  imagePath={item.imagePath}
  productName={item.productName}
/>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-semibold text-on-surface">
                                    {item.productName}
                                </h3>

                                <p className="mt-1 text-[11px] text-on-surface-variant">
                                    SKU: {item.sku}
                                </p>

                                <p className="mt-1 text-xs text-on-surface-variant">
                                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                                </p>
                            </div>

                            <p className="shrink-0 font-display text-lg font-semibold text-on-surface">
                                {formatCurrency(item.lineTotal)}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline/20 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Payment Summary
                    </p>

                    <span className="rounded-full bg-primary-container/40 px-2.5 py-1 text-xs font-semibold text-on-primary-container">
                        {detail.paymentStatus}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-container-lowest p-3 text-sm">
                    <CreditCard size={18} className="text-primary" />
                    <span className="font-medium text-on-surface">
                        {detail.paymentMethod ?? "Payment method unavailable"}
                    </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-on-surface-variant">
                        <span>Subtotal</span>
                        <span>{formatCurrency(detail.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-on-surface-variant">
                        <span>Shipping fee</span>
                        <span>
                            {detail.shippingFee === 0
                                ? "Complimentary"
                                : formatCurrency(detail.shippingFee)}
                        </span>
                    </div>

                    <div className="flex justify-between border-t border-outline/20 pt-3 font-semibold text-on-surface">
                        <span>Total</span>
                        <span className="font-display text-xl">
                            {formatCurrency(order.total)}
                        </span>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-outline/20 pb-3">
                    <Truck size={17} className="text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Shipping & Fulfillment
                    </p>
                </div>

                {address ? (
                    <div className="mt-4 flex gap-2 text-sm text-on-surface">
                        <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />

                        <div>
                            <p className="font-semibold">{address.recipientName}</p>
                            <p className="mt-1 text-on-surface-variant">
                                {address.addressLine1}
                            </p>
                            {address.addressLine2 && (
                                <p className="text-on-surface-variant">
                                    {address.addressLine2}
                                </p>
                            )}
                            <p className="text-on-surface-variant">
                                {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-on-surface-variant">{address.country}</p>
                        </div>
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-on-surface-variant">
                        No shipping address recorded.
                    </p>
                )}

                <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 text-sm">
                    <span className="text-on-surface-variant">Tracking</span>
                    <span className="font-semibold text-on-surface">
                        {detail.trackingCarrier && `${detail.trackingCarrier} · `}
                        {detail.trackingNumber ?? "Will be added when shipped"}
                    </span>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Order Timeline
                </p>

                {timeline.length > 0 ? (
                    <div className="mt-4 space-y-4">
                        {timeline.map((event) => (
                            <article
                                key={`${event.title}-${event.createdAt}`}
                                className="border-l-2 border-primary/30 pl-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-on-surface">
                                        {event.title}
                                    </p>
                                    {event.status && (
                                        <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-on-surface">
                                            {event.status}
                                        </span>
                                    )}
                                </div>

                                {event.note && (
                                    <p className="mt-1 text-xs text-on-surface-variant">
                                        {event.note}
                                    </p>
                                )}

                                <p className="mt-1 text-[11px] text-on-surface-variant">
                                    {formatDate(event.createdAt)}
                                </p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-on-surface-variant">
                        No order events recorded yet.
                    </p>
                )}
            </section>
            <FulfillmentActionButton
                orderNumber={order.id}
                status={order.status}
            />
            <ShipmentForm
                orderNumber={order.id}
                status={order.status}
            />
        </main>
    );
}