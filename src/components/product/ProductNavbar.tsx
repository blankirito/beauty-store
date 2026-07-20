"use client";
import { useRouter } from "next/navigation"; 
import { ArrowLeft, Share2 } from "lucide-react";

export default function ProductNavbar() {

    const router = useRouter();

    return (
        <header className="
            sticky
            top-0
            z-50
            h-16
            flex
            items-center
            justify-between
            px-5
            bg-surface/80
            backdrop-blur-md
        ">
            <button
                onClick={() => router.back() }
                className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                text-primary
                hover:bg-surface-low
                transition
            ">
                <ArrowLeft size={22} />
            </button>

            <h1 className="
                font-display
                text-xl
                text-primary
            ">Boutique</h1>

            <button className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                text-primary
                hover:bg-surface-low
                transition
            ">
                <Share2 size={22} />
            </button>
        </header>
    );
}