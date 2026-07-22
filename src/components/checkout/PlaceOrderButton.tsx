import {
    ShoppingBag
} from "lucide-react";
import Link from "next/link";

export default function PlaceOrderButton() {
    return (
        <div className="
            left-0
            w-full
            z-40
            px-5
            py-4
        ">
            <Link
                href="/ordersuccess"
            >
                <button className="
                    w-full
                    bg-primary
                    text-white
                    py-4
                    rounded-full
                    text-lg
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-md
                    active:scale-[0.98]
                    transition
                ">
                    <ShoppingBag size={20} />
                    Place Order · RM228.90
                </button>
            </Link>
            
            <p className="
                text-center
                text-xs
                text-on-surface-variant
                mt-2
            ">
                By placing an order, you agree to our Terms and Conditions.
            </p>
        </div>
    )
}