"use client";

import {
    X,
} from "lucide-react";
import { useRouter } from "next/navigation"; 

export default function SuccessHeader() {

    const router = useRouter();

    return (
        <header className="
            sticky
            top-0
            z-50
            h-16
            w-full
            flex
            justify-between
            items-center
            px-5
            bg-surface
            border-b
            border-surface-low
        ">
            <h1 className="
                text-xl
                font-display
                text-primary
            ">Boutique</h1>

            <button
                onClick={() => router.push("/")}
                className="
                    p-2
                    rounded-full
                    hover:bg-surface-low
                ">
                    <X size={22} className="text-on-surface-variant" />
            </button>
        </header>
    )
}