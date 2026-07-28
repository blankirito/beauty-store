import {
    ReceiptText,
    Heart,
    MapPin,
    Settings,
    Info,
    ArrowRight,
    CreditCard,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

const menu: {
    name: string;
    icon: LucideIcon;
    href: string;
}[] = [
    {
        name: "Order",
        icon: ReceiptText,
        href: "/orders",
        
    },
    {
        name: "Payment Method",
        icon: CreditCard,
        href: "/paymentmethod",
    },
    {
        name: "Wishlist",
        icon: Heart,
        href: "/wishlist",
    },
    {
        name: "Saved Addresses",
        icon: MapPin,
        href: "/savedaddress",
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/settings",
    },
    {
        name: "Help Center",
        icon: Info,
        href: "/helpcenter",
    },
];
export default function ProfileMenu() {
    return (
        <section className="
            px-5
            space-y-3
        ">
            {
                menu.map((menus)=>{

                    const Icon = menus.icon;

                    return (
                        <Link
                            key={menus.name}
                            href={menus.href}
                            className="
                                w-full
                                flex
                                items-center
                                justify-between
                                bg-surface
                                p-4
                                rounded-xl
                                shadow-sm
                                hover:bg-surface-low
                                active:scale-[0.97]
                            "
                        >

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-10
                                    h-10
                                    rounded-lg
                                    bg-primary-fixed
                                    flex
                                    items-center
                                    justify-center
                                    text-primary
                                ">
                                    <Icon size={20}/>
                                </div>


                                <span className="
                                    text-lg
                                    text-on-surface
                                ">
                                    {menus.name}
                                </span>

                            </div>


                            <ArrowRight
                                size={20}
                                className="
                                    text-outline
                                "
                            />

                        </Link>
                    )
                })
            }
        </section>
    )
}