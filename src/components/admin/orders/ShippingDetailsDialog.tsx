"use client";

import { Truck, X } from "lucide-react";
import { useState } from "react";

type ShippingDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: {
    carrier: string;
    trackingNumber: string;
  }) => void;
};

export default function ShippingDetailsDialog({
  isOpen,
  onClose,
  onConfirm,
}: ShippingDetailsDialogProps) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  if (!isOpen) {
    return null;
  }

  function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onConfirm({
      carrier,
      trackingNumber,
    });

    setCarrier("");
    setTrackingNumber("");
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end bg-on-surface/35 p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shipping-dialog-title"
    >
      <button
        type="button"
        aria-label="Close shipping dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <form
        onSubmit={handleConfirm}
        className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-primary">
            <Truck size={21} />
          </div>

          <button
            type="button"
            aria-label="Close shipping dialog"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="shipping-dialog-title"
          className="mt-4 font-display text-2xl text-on-surface"
        >
          Mark as Shipped
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Add shipment details before marking this order as shipped.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-on-surface">
              Shipping Carrier
            </span>

            <input
              value={carrier}
              onChange={(event) => setCarrier(event.target.value)}
              placeholder="e.g. J&T Express"
              className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-low px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-on-surface">
              Tracking Number
            </span>

            <input
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="e.g. JNTMY123456789"
              className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-low px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-outline/25 bg-surface text-sm font-semibold text-on-surface transition hover:bg-surface-container"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            <Truck size={17} />
            Mark as Shipped
          </button>
        </div>
      </form>
    </div>
  );
}