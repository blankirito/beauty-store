"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="
            relative
            max-w-3xl
            mx-auto
        ">
            <Search className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-outline
            "
                size={20}
            />

            <input 
                placeholder="Search FAQs..."
                className="
                    w-full
                    rounded-full
                    bg-surface-low
                    py-4
                    pl-14
                    pr-5
                    border
                    border-outline/30
                    outline-none
                    focus:border-primary
                "
            />
        </div>
    )
}