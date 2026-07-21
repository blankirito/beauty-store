import {
    Heart,
    MapPin,
    Settings,
    Info,
    ArrowRight,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

const menu: {
    name: string;
    icon: LucideIcon;
}[] = [
    {
        name: "Wishlist",
        icon: Heart,
    },
    {
        name: "Saved Addresses",
        icon: MapPin,
    },
    {
        name: "Settings",
        icon: Settings,
    },
    {
        name: "Help Center",
        icon: Info,
    },
]

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
                        <div
                            key={menus.name}
                            className="
                                w-full
                                flex
                                items-center
                                justify-between
                                bg-surface
                                p-4
                                rounded-xl
                                shadow-sm
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

                        </div>
                    )
                })
            }
        </section>
    )
}