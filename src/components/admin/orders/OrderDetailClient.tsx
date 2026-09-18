"use client";

import type { AdminOrder } from "@/data/adminOrders";
import type { AdminOrderDetail } from "@/data/adminOrderDetails";
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    FileText,
    MapPin,
    Package,
    Truck,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ShippingDetailsDialog from "./ShippingDetailsDialog";

type OrderDetailClientProps = {
    order: AdminOrder;
    detail: AdminOrderDetail;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
    }).format(value);
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

type TimelineState = "done" | "current" | "upcoming";

function getTimelineSteps(status: AdminOrder["status"]) {
    if (status === "Cancelled") {
        return [
            { label: "Order Placed", state: "done" as TimelineState },
            { label: "Payment Confirmed", state: "done" as TimelineState },
            { label: "Order Cancelled", state: "current" as TimelineState },
        ];
    }

    const processingState: TimelineState =
        status === "New" ? "upcoming" : status === "Processing" ? "current" : "done";

    const shippedState: TimelineState =
        status === "Shipped" ? "current" : status === "Delivered" ? "done" : "upcoming";

    const deliveredState: TimelineState =
        status === "Delivered" ? "current" : "upcoming";

    return [
        { label: "Order Placed", state: "done" as TimelineState },
        { label: "Payment Confirmed", state: "done" as TimelineState },
        { label: "Processing", state: processingState },
        { label: "Shipped", state: shippedState },
        { label: "Delivered", state: deliveredState },
    ];
}

function getActionLabel(status: AdminOrder["status"]) {
    if (status === "New") return "Process Order";
    if (status === "Processing") return "Mark as Shipped";
    if (status === "Shipped") return "Track Shipment";
    if (status === "Delivered") return "Receipt / Invoice";
    return null;
}

export default function OrderDetailClient({
    order,
    detail,
}: OrderDetailClientProps) {
    const [isOrderIdCopied, setIsOrderIdCopied] = useState(false);
    const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);

    async function handleCopyOrderId() {
        await navigator.clipboard.writeText(order.id);
        setIsOrderIdCopied(true);

        window.setTimeout(() => {
            setIsOrderIdCopied(false);
        }, 1800);
    }

    return (
        <main className="min-h-screen space-y-5 bg-surface px-5 py-6 pb-28">
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

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-display text-3xl text-on-surface">
                                #{order.id}
                            </h1>

                            <button
                                type="button"
                                onClick={handleCopyOrderId}
                                aria-label="Copy order ID"
                                className="text-on-surface-variant transition hover:text-primary"
                            >
                                {isOrderIdCopied ? <Check size={17} /> : <Copy size={17} />}
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-on-surface-variant">{order.date}</p>
                    </div>

                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
                    >
                        {order.status}
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-outline/20 pt-3 text-xs">
                    <span className="text-on-surface-variant">Sales channel</span>
                    <span className="rounded-md bg-surface-container px-2.5 py-1 font-medium text-on-surface">
                        Boutique Web Checkout
                    </span>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline/20 pb-3">
                    <div className="flex items-center gap-2">
                        <UserRound size={17} className="text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            Customer
                        </p>
                    </div>

                    <span className="text-xs text-on-surface-variant">
                        {detail.customerId}
                    </span>
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
                            {detail.customerPhone}
                        </p>
                    </div>
                </div>

                <Link
                href={`/admin/customers/${detail.customerId}`}
                className="mt-4 ml-auto flex w-fit text-xs font-semibold text-primary transition hover:opacity-75"
                >
                View Customer Profile
                </Link>
            </section>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
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
                            <img
                                src={item.image}
                                alt={item.productName}
                                className="h-14 w-14 shrink-0 rounded-xl border border-outline/15 bg-surface-container object-cover"
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
                                {formatCurrency(item.quantity * item.unitPrice)}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline/20 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Payment Summary
                    </p>

                    <span
                        className={
                            detail.paymentStatus === "Paid"
                                ? "rounded-full bg-primary-container/40 px-2.5 py-1 text-xs font-semibold text-on-primary-container"
                                : "rounded-full bg-error-container px-2.5 py-1 text-xs font-semibold text-error"
                        }
                    >
                        {detail.paymentStatus}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-container-lowest p-3 text-sm">
                    <CreditCard size={18} className="text-primary" />
                    <span className="font-medium text-on-surface">{order.payment}</span>
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
                        <span>Total paid</span>
                        <span className="font-display text-xl">
                            {formatCurrency(order.total)}
                        </span>
                    </div>
                </div>
            </section>
            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-outline/20 pb-3">
                    <Truck size={17} className="text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Shipping & Fulfillment
                    </p>
                </div>

                <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                        Delivery Address
                    </p>

                    <div className="mt-2 flex gap-2 text-sm text-on-surface">
                        <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />

                        <div>
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="mt-1 text-on-surface-variant">
                                {detail.shippingAddress.street}
                            </p>
                            <p className="text-on-surface-variant">
                                {detail.shippingAddress.city}, {detail.shippingAddress.state}{" "}
                                {detail.shippingAddress.postalCode}
                            </p>
                            <p className="text-on-surface-variant">
                                {detail.shippingAddress.country}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-outline/20 pt-4 text-sm">
                    <div>
                        <p className="text-xs text-on-surface-variant">Shipping Method</p>
                        <p className="mt-1 font-semibold text-on-surface">
                            {detail.shippingMethod}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-on-surface-variant">Estimated Delivery</p>
                        <p className="mt-1 font-semibold text-on-surface">
                            {detail.estimatedDelivery ?? "Available after shipment"}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 text-sm">
                    <span className="text-on-surface-variant">Tracking Number</span>
                    <span className="font-semibold text-on-surface">
                        {detail.trackingNumber ?? "Will be added when shipped"}
                    </span>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Order Timeline
                </p>

                <div className="relative mt-5 space-y-5 pl-7">
                    <div className="absolute bottom-3 left-[9px] top-3 w-px bg-outline/30" />

                    {getTimelineSteps(order.status).map((step) => (
                        <div key={step.label} className="relative">
                            <span
                                className={
                                    step.state === "done"
                                        ? "absolute -left-7 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary ring-4 ring-surface-container-low"
                                        : step.state === "current"
                                            ? "absolute -left-7 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-on-secondary ring-4 ring-surface-container-low"
                                            : "absolute -left-7 top-0 h-5 w-5 rounded-full border-2 border-outline/40 bg-surface-container-low ring-4 ring-surface-container-low"
                                }
                            >
                                {step.state === "done" && <Check size={13} />}
                            </span>

                            <div className={step.state === "upcoming" ? "opacity-50" : ""}>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-on-surface">{step.label}</p>

                                    {step.state === "current" && (
                                        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold text-on-secondary-container">
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-xs text-on-surface-variant">
                                    {step.state === "done"
                                        ? "Completed"
                                        : step.state === "current"
                                            ? "Current order status"
                                            : "Pending"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {getActionLabel(order.status) && (
                <aside className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline/20 bg-surface/95 px-5 py-3 backdrop-blur-xl lg:left-64">
                    <div className="mx-auto max-w-3xl">
                        <button
                            type="button"
                            onClick={() => {
                            if (order.status === "Processing") {
                                setIsShippingDialogOpen(true);
                            }
                            }}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90"
                        >
                            {order.status === "Delivered" ? (
                            <FileText size={17} />
                            ) : order.status === "New" ? (
                            <CheckCircle2 size={17} />
                            ) : (
                            <Truck size={17} />
                            )}

                            {getActionLabel(order.status)}
                        </button>
                        </div>
                </aside>
            )}
            <ShippingDetailsDialog
                isOpen={isShippingDialogOpen}
                onClose={() => setIsShippingDialogOpen(false)}
                onConfirm={() => {
                    // UI stage only — backend will save tracking and update the status.
                    setIsShippingDialogOpen(false);
                }}
            />
        </main>
    );
}