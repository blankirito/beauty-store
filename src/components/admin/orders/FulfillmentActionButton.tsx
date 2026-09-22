"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateOrderFulfillment } from "@/app/admin/orders/[id]/actions";
import type { AdminOrder } from "@/lib/orders/adminOrder";

type FulfillmentActionButtonProps = {
  orderNumber: string;
  status: AdminOrder["status"];
};

export default function FulfillmentActionButton({
  orderNumber,
  status,
}: FulfillmentActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status !== "New" && status !== "Shipped") {
    return null;
  }

  const nextStatus = status === "New" ? "processing" : "delivered";
  const actionLabel =
    status === "New" ? "Process Order" : "Mark as Delivered";
  const pendingLabel =
    status === "New" ? "Processing order…" : "Updating delivery…";

  function handleFulfillmentUpdate() {
    setError(null);

    startTransition(async () => {
      const result = await updateOrderFulfillment(
        orderNumber,
        nextStatus,
      );

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <button
        type="button"
        onClick={handleFulfillmentUpdate}
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <CheckCircle2 size={18} />
        )}

        {isPending ? pendingLabel : actionLabel}
      </button>

      {error && (
        <p className="mt-3 text-center text-xs font-medium text-error">
          {error}
        </p>
      )}
    </section>
  );
}