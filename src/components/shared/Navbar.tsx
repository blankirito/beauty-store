"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import SideMenu from "./SideMenu";
import Link from "next/link";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header
                className="
                    sticky
                    top-0
                    z-50
                    h-16
                    px-5
                    bg-background
                    flex
                    items-center
                    justify-between
                    border-b
                    border-outline/40
                "
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setOpen(true)}
                        className="
                            text-primary
                            p-2
                            rounded-full
                            hover:bg-surface-low
                        "
                    >
                        <Menu size={24} />
                    </button>

                    <Link href="/">
                        <h1
                            className="
                                text-2xl
                                font-display
                                text-primary
                            "
                        >
                            Boutique
                        </h1>
                    </Link>
                </div>

                <Link
                    href="/search"
                    className="
                        text-primary
                        p-2
                        rounded-full
                        hover:bg-surface-low
                    "
                >
                    <Search size={22} />
                </Link>
            </header>

            <SideMenu
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}