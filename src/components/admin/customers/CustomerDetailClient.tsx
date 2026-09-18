"use client";

import type { AdminCustomer } from "@/data/adminCustomers";
import type { AdminCustomerDetail } from "@/data/adminCustomerDetails";
import type { AdminOrder } from "@/data/adminOrders";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    Copy,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShoppingBag,
    WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SendEmailDialog from "./SendEmailDialog";

type CustomerDetailClientProps = {
    customer: AdminCustomer;
    detail: AdminCustomerDetail;
    recentOrders: AdminOrder[];
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
    }).format(value);
}

function getStatusClass(status: AdminCustomer["status"]) {
    if (status === "VIP") {
        return "bg-primary-container/50 text-on-primary-container";
    }

    if (status === "Active") {
        return "bg-secondary-container text-on-secondary-container";
    }

    if (status === "New") {
        return "bg-surface-container text-primary";
    }

    return "bg-surface-container text-on-surface-variant";
}

function getOrderStatusClass(status: AdminOrder["status"]) {
    if (status === "New" || status === "Cancelled") {
        return "bg-error-container text-error";
    }

    if (status === "Processing") {
        return "bg-secondary-container text-on-secondary-container";
    }

    return "bg-primary-container/40 text-on-primary-container";
}

export default function CustomerDetailClient({
    customer,
    detail,
    recentOrders,
}: CustomerDetailClientProps) {
    const [isCustomerIdCopied, setIsCustomerIdCopied] = useState(false);

    const averageOrderValue =
        customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 0;

    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    async function handleCopyCustomerId() {
        await navigator.clipboard.writeText(customer.id);
        setIsCustomerIdCopied(true);

        window.setTimeout(() => {
            setIsCustomerIdCopied(false);
        }, 1800);
    }

    return (
        <main className="min-h-screen space-y-5 bg-surface px-5 py-6 pb-28">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/customers"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
                >
                    <ArrowLeft size={17} />
                    Customers
                </Link>

                <span className="text-xs text-on-surface-variant">
                    Customers / {customer.id}
                </span>
            </div>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-container text-lg font-bold text-primary">
                        {customer.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate font-display text-2xl text-on-surface">
                                {customer.name}
                            </h1>

                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(customer.status)}`}
                            >
                                {customer.status === "VIP" ? "VIP Member" : customer.status}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-on-surface-variant">
                                {customer.id}
                            </span>

                            <button
                                type="button"
                                onClick={handleCopyCustomerId}
                                aria-label="Copy customer ID"
                                className="text-on-surface-variant transition hover:text-primary"
                            >
                                {isCustomerIdCopied ? <Check size={15} /> : <Copy size={15} />}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-on-surface-variant">
                            Member since {customer.memberSince}
                        </p>
                    </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-outline/20 pt-4 text-sm">
                    <div className="flex items-center gap-2 text-on-surface">
                        <Mail size={16} className="text-primary" />
                        <span className="truncate">{customer.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-on-surface">
                        <Phone size={16} className="text-primary" />
                        <span>{detail.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-on-surface">
                        <MapPin size={16} className="text-primary" />
                        <span>{customer.location}</span>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
                <article className="rounded-2xl bg-surface-container-low p-3.5 shadow-sm">
                    <ShoppingBag size={18} className="text-primary" />
                    <p className="mt-3 text-xs text-on-surface-variant">Total Orders</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-on-surface">
                        {customer.orderCount}
                    </p>
                </article>

                <article className="rounded-2xl bg-surface-container-low p-3.5 shadow-sm">
                    <WalletCards size={18} className="text-primary" />
                    <p className="mt-3 text-xs text-on-surface-variant">Total Spent</p>
                    <p className="mt-1 font-display text-xl font-semibold text-on-surface">
                        {formatCurrency(customer.totalSpent)}
                    </p>
                </article>

                <article className="rounded-2xl bg-surface-container-low p-3.5 shadow-sm">
                    <WalletCards size={18} className="text-primary" />
                    <p className="mt-3 text-xs text-on-surface-variant">
                        Avg. Order Value
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-on-surface">
                        {formatCurrency(averageOrderValue)}
                    </p>
                </article>

                <article className="rounded-2xl bg-surface-container-low p-3.5 shadow-sm">
                    <CalendarDays size={18} className="text-primary" />
                    <p className="mt-3 text-xs text-on-surface-variant">Last Order</p>
                    <p className="mt-1 font-display text-xl font-semibold text-on-surface">
                        {customer.lastOrder}
                    </p>
                </article>
            </section>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline/20 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Recent Orders
                    </p>

                    <Link
                        href={`/admin/orders?customer=${customer.id}`}
                        className="text-xs font-semibold text-primary transition hover:opacity-75"
                    >
                        View all orders
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="mt-3 space-y-2.5">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="block rounded-xl border border-outline/15 bg-surface-container-lowest p-3 transition hover:border-primary/35"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-on-surface">
                                            #{order.id}
                                        </p>
                                        <p className="mt-1 text-xs text-on-surface-variant">
                                            {order.date}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getOrderStatusClass(order.status)}`}
                                        >
                                            {order.status}
                                        </span>

                                        <p className="mt-2 font-display text-lg font-semibold text-on-surface">
                                            {formatCurrency(order.total)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 rounded-xl bg-surface-container-lowest p-3 text-sm text-on-surface-variant">
                        No recent orders are available in the current demo data.
                    </p>
                )}
            </section>

            <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-outline/20 pb-3">
                    <MapPin size={17} className="text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Shipping Address
                    </p>
                </div>

                <div className="mt-4 rounded-xl bg-surface-container-lowest p-3 text-sm leading-relaxed text-on-surface">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="mt-1 text-on-surface-variant">{detail.address.street}</p>
                    <p className="text-on-surface-variant">
                        {detail.address.city}, {detail.address.state}{" "}
                        {detail.address.postalCode}
                    </p>
                    <p className="text-on-surface-variant">{detail.address.country}</p>
                </div>

                <div className="mt-4 border-t border-outline/20 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Account Details
                    </p>

                    <div className="mt-3 flex justify-between gap-4 text-sm">
                        <span className="text-on-surface-variant">Account Created</span>
                        <span className="text-right font-medium text-on-surface">
                            {detail.accountCreated}
                        </span>
                    </div>

                    <div className="mt-2 flex justify-between gap-4 text-sm">
                        <span className="text-on-surface-variant">Member Since</span>
                        <span className="font-medium text-on-surface">
                            {customer.memberSince}
                        </span>
                    </div>
                </div>
            </section>

            <aside className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline/20 bg-surface/95 px-5 py-3 backdrop-blur-xl lg:left-64">
                <div className="mx-auto flex max-w-3xl gap-3">
                    <button
                        type="button"
                        onClick={() => setIsEmailDialogOpen(true)}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-outline/25 bg-surface-container-lowest text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                    >
                        <Mail size={17} />
                        Send Email
                    </button>

                    <Link
                        href={`/admin/customers/${customer.id}/edit`}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90"
                    >
                        <Pencil size={17} />
                        Edit Customer
                    </Link>
                </div>
            </aside>
            <SendEmailDialog
                isOpen={isEmailDialogOpen}
                customerName={customer.name}
                customerEmail={customer.email}
                onClose={() => setIsEmailDialogOpen(false)}
                onSend={() => {
                    // UI stage only — actual email delivery comes with backend.
                    setIsEmailDialogOpen(false);
                }}
            />
        </main>
    );
}