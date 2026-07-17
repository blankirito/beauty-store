import {
    Home,
    ShoppingBag,
    ReceiptText,
    User
} from "lucide-react";

export default function BottomNavigation() {
    return (
        <nav 
            className="
                fixed
                bottom-0
                left-0
                w-full
                bg-surface
                shadow-sm
                flex
                justify-around
                items-center
                py-3
                z-50
                border-t
                border-outline
            ">
                <button className="flex flex-col items-center gap-1 text-primary font-semibold">
                    <Home size={22} fill="currentColor"/>
                    <span className="text-xs">Home</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <ShoppingBag size={22} />
                    <span className="text-xs">Cart</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <ReceiptText size={22} />
                    <span className="text-xs">Orders</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <User size={22}/>
                    <span className="text-xs">Profile</span>
                </button>
            </nav>
    );
}