"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

export default function CheckoutBar() {
  const router = useRouter();
  const { items, isReady } = useCart();

  const selectedItemCount = items
    .filter((item) => item.isSelected)
    .reduce((total, item) => total + item.quantity, 0);

  const isDisabled = !isReady || selectedItemCount === 0;

  return (
    <div className="w-full px-5 py-4">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => router.push("/checkout")}
        className={
          isDisabled
            ? "flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-outline/40 py-4 text-lg font-semibold text-on-surface-variant"
            : "flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-semibold text-white shadow-md transition active:scale-[0.98] hover:opacity-90"
        }
      >
        Proceed to Checkout
        {selectedItemCount > 0 && ` (${selectedItemCount})`}
        <ArrowRight size={20} />
      </button>
    </div>
  );
}