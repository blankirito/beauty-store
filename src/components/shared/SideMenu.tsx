"use client";

import Link from "next/link";
import {
    X,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function SideMenu({
    open,
    onClose,
}: Props) {
    return (
        <>
            {/* Overlay */}

            <div
                onClick={onClose}
                className={`
                    fixed inset-0
                    bg-black/40
                    transition-opacity
                    duration-300
                    z-40

                    ${
                        open
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                    }
                `}
            />

            {/* Drawer */}

            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    h-screen
                    w-72
                    bg-surface
                    z-50
                    shadow-xl
                    transition-transform
                    duration-300

                    ${
                        open
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="flex justify-between items-center p-5 border-b border-outline">

                    <h2 className="font-display text-2xl text-primary">
                        Boutique
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-primary"
                    >
                        <X />
                    </button>

                </div>

                <nav className="p-3 space-y-2">

                    <Link
                        href="/"
                        className="block p-3 rounded-lg hover:bg-surface-low"
                    >
                        Home
                    </Link>

                    <button
                        className="
                            w-full
                            flex
                            justify-between
                            items-center
                            p-3
                            rounded-lg
                            hover:bg-surface-low
                        "
                    >
                        Products

                        <ChevronDown size={18} />
                    </button>

                    <div className="ml-5 space-y-2">

                        <button
                            className="
                                flex
                                justify-between
                                w-full
                                py-2
                            "
                        >
                            Skincare

                            <ChevronRight size={16}/>
                        </button>

                        <button
                            className="
                                flex
                                justify-between
                                w-full
                                py-2
                            "
                        >
                            Makeup

                            <ChevronRight size={16}/>
                        </button>

                        <button
                            className="
                                flex
                                justify-between
                                w-full
                                py-2
                            "
                        >
                            Haircare

                            <ChevronRight size={16}/>
                        </button>

                    </div>

                    <Link
                        href="/profile"
                        className="block p-3 rounded-lg hover:bg-surface-low"
                    >
                        Profile
                    </Link>

                </nav>
            </aside>
        </>
    );
}