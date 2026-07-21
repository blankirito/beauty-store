"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    ShoppingBag,
    ReceiptText,
    User
} from "lucide-react";

export default function BottomNavigation() {

    const pathname = usePathname();

    const navItems = [
        {
            name: "Home",
            path: "/",
            icons: Home,
        },
        {
            name: "Cart",
            path: "/cart",
            icons: ShoppingBag,
        },
        {
            name: "Orders",
            path: "/orders",
            icons: ReceiptText,
        },
        {
            name: "Profile",
            path: "/profile",
            icons: User,
        },
    ]
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
                { 
                    navItems.map((item) => {
                        const Icon = item.icons;
                        const active = pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-1
                                    transition
                                    ${
                                        active
                                        ? "text-primary"
                                        : "text-on-surface-variant"
                                    }  
                                `}
                            >
                                <Icon 
                                    size={22}
                                    fill={active ? "currentColor" : "none"}
                                />
                                
                                <span className="text-xs font-semibold">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })
                }
            </nav>
    );
}