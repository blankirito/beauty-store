"use client";

import { LoaderCircle, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { shipOrder } from "@/app/admin/orders/[id]/actions";
import type { AdminOrder } from "@/lib/orders/adminOrder";

type ShipmentFormProps = {
  orderNumber: string;
  status: AdminOrder["status"];
};

export default function ShipmentForm({
  orderNumber,
  status,
}: ShipmentFormProps) {
  const router = useRouter();
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (status !== "Processing") {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await shipOrder(
        orderNumber,
        carrier,
        trackingNumber,
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
      <div className="flex items-center gap-2">
        <Truck size={18} className="text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-on-surface">
            Mark as Shipped
          </h2>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Add tracking details before confirming shipment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-on-surface">
            Shipping carrier
          </span>
          <input
            value={carrier}
            onChange={(event) => setCarrier(event.target.value)}
            placeholder="e.g. DHL, J&T Express"
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-outline/25 bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-on-surface">
            Tracking number
          </span>
          <input
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="e.g. DHL-123456"
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-outline/25 bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Truck size={18} />
          )}

          {isPending ? "Saving shipment…" : "Confirm Shipment"}
        </button>

        {error && (
          <p className="text-center text-xs font-medium text-error">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}