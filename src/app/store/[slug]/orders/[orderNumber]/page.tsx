import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuestOrderTracking } from "@/lib/storefront/getGuestOrderTracking";

type GuestOrderTrackingPageProps = {
    params: Promise<{
        slug: string;
        orderNumber: string;
    }>;
    searchParams: Promise<{
        token?: string;
    }>;
};

function formatMoney(value: number) {
    return `RM${Number(value).toFixed(2)}`;
}

export default async function GuestOrderTrackingPage({
    params,
    searchParams,
}: GuestOrderTrackingPageProps) {
    const { slug, orderNumber } = await params;
    const { token } = await searchParams;

    if (!token) {
        notFound();
    }

    const order = await getGuestOrderTracking(slug, orderNumber, token);

    if (!order) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#fbf9f6] px-5 py-8 text-[#392219]">
            <div className="mx-auto max-w-md">
                <Link
                    href={`/store/${slug}`}
                    className="text-sm font-semibold text-[#915747]"
                >
                    ← Back to store
                </Link>

                <section className="mt-6 rounded-3xl border border-[#eee6e1] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold tracking-[0.18em] text-[#8c5a4b]">
                        ORDER TRACKING
                    </p>
                    <h1 className="mt-2 font-serif text-4xl">{order.orderNumber}</h1>
                    <p className="mt-2 text-sm text-[#6f574d]">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-5 flex gap-3">
                        <span className="rounded-full bg-[#f6e6e0] px-3 py-1 text-sm font-semibold capitalize text-[#915747]">
                            {order.fulfillmentStatus}
                        </span>
                        <span className="rounded-full bg-[#f6e6e0] px-3 py-1 text-sm font-semibold capitalize text-[#915747]">
                            Payment: {order.paymentStatus}
                        </span>
                    </div>
                </section>

                <section className="mt-5 rounded-3xl bg-[#f4f1ed] p-6">
                    <h2 className="font-serif text-2xl">Your items</h2>

                    <div className="mt-4 space-y-4">
                        {order.items.map((item, index) => (
                            <div
                                key={`${item.name}-${index}`}
                                className="flex items-center justify-between border-b border-[#e1d7d1] pb-4 last:border-0 last:pb-0"
                            >
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="mt-1 text-sm text-[#735b51]">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-semibold">{formatMoney(item.lineTotal)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 border-t border-[#d9ccc5] pt-4">
                        <div className="flex justify-between font-serif text-2xl">
                            <span>Total</span>
                            <span>{formatMoney(order.total)}</span>
                        </div>
                    </div>
                </section>

                <section className="mt-5 rounded-3xl border border-[#eee6e1] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-2xl">Payment</h2>
                    <p className="mt-3 font-semibold">{order.paymentMethodLabel}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6f574d]">
                        {order.paymentMethodInstructions}
                    </p>
                </section>

                <section className="mt-5 rounded-3xl border border-[#eee6e1] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-2xl">Delivery updates</h2>

                    {order.trackingNumber ? (
                        <p className="mt-3 text-sm">
                            {order.trackingCarrier ?? "Carrier"}: {order.trackingNumber}
                        </p>
                    ) : (
                        <p className="mt-3 text-sm text-[#6f574d]">
                            Your store will add tracking details once the order is shipped.
                        </p>
                    )}

                    <div className="mt-5 space-y-4 border-l-2 border-[#d9ccc5] pl-4">
                        {order.events.map((event, index) => (
                            <div key={`${event.createdAt}-${index}`}>
                                <p className="font-semibold">{event.title}</p>
                                <p className="mt-1 text-sm text-[#6f574d]">{event.note}</p>
                                <p className="mt-1 text-xs text-[#80695f]">
                                    {new Date(event.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}