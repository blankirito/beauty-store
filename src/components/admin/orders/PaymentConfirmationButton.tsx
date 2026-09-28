"use client";

import { BadgeCheck, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { confirmOrderPayment } from "@/app/admin/orders/[id]/actions";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import type { OrderStatus, PaymentStatus } from "@/lib/orders/adminOrder";

type PaymentConfirmationButtonProps = {
    orderNumber: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
};

export default function PaymentConfirmationButton({
    orderNumber,
    paymentStatus,
    orderStatus,
}: PaymentConfirmationButtonProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (paymentStatus !== "Pending" || orderStatus === "Cancelled") {
        return null;
    }

    function handleOpenDialog() {
        setError(null);
        setIsDialogOpen(true);
    }

    function handleConfirmPayment() {
        setIsDialogOpen(false);
        setError(null);

        startTransition(async () => {
            const result = await confirmOrderPayment(orderNumber);

            if ("error" in result) {
                setError(result.error);
                return;
            }

            router.refresh();
        });
    }

    return (
        <>
            <section className="rounded-2xl border border-secondary/20 bg-secondary-container/30 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-secondary-container p-2 text-on-secondary-container">
                        <BadgeCheck size={18} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-on-surface">
                            Payment pending
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                            Confirm only after you have received the bank transfer
                            or COD payment.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleOpenDialog}
                    disabled={isPending}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? (
                        <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                        <BadgeCheck size={17} />
                    )}

                    {isPending ? "Confirming payment…" : "Mark as paid"}
                </button>

                {error && (
                    <p className="mt-3 text-center text-xs font-medium text-error">
                        {error}
                    </p>
                )}
            </section>

            <ConfirmationDialog
                isOpen={isDialogOpen}
                title="Mark this order as paid?"
                description="Only continue after you have received the bank transfer or COD payment. This will record a payment confirmation in the order timeline."
                cancelLabel="Not yet"
                confirmLabel="Confirm payment"
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmPayment}
            />
        </>
    );
}