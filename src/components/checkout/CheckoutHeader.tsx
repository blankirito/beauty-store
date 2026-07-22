"use client";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Lock,
} from "lucide-react";

export default function CheckoutHeader() {
    
    const router = useRouter();

    return (
        <header className="
            sticky
            top-0
            z-50
            w-full
            flex
            justify-between
            items-center
            h-16
            px-5
            bg-surface
        ">
            <div className="
                flex
                items-center
                gap-4
            ">
                <button 
                    onClick={() => router.back() }
                    className="
                    p-2
                    rounded-full
                    hover:bg-surface-container
                ">
                    <ArrowLeft size={22}/>
                </button>

                <h1 className="
                    text-primary
                    text-xl
                    font-semibold
                ">
                    Boutique
                </h1>
            </div>

            <div className="
                flex
                items-center
                gap-2
                text-primary
            ">
                <Lock size={18} />

                <span className="
                    hidden
                    md:block
                    text-sm
                    text-on-surface-variant
                ">
                    Secure Checkout
                </span>
            </div>
        </header>
    )
}