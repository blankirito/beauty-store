"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  id: number;
  quantity: number;
};

export default function BottomActionBar({ id, quantity }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  function handleAddToCart() {
    addItem(id, quantity);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  }

  function handleBuyNow() {
    addItem(id, quantity);
    router.push(`/checkout?product=${id}&quantity=${quantity}`);
  }

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-center gap-3 border-t border-outline bg-surface px-5 py-4 shadow-lg">
      <button
        type="button"
        onClick={handleAddToCart}
        className={
          isAdded
            ? "flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold uppercase tracking-wider text-white transition"
            : "flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent text-sm font-bold uppercase tracking-wider text-primary transition hover:bg-primary/5"
        }
      >
        {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
        {isAdded ? "Added" : "Add to Cart"}
      </button>

      <button
        type="button"
        onClick={handleBuyNow}
        className="flex h-14 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
      >
        Buy Now
      </button>
    </nav>
  );
}