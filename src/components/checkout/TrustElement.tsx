import {
    ShieldCheck,
    Truck,
    RefreshCcw
} from "lucide-react";

const trustItems = [
    {
        icon: ShieldCheck,
        title: "Encrypted",
    },
    {
        icon: Truck,
        title: "Insured",
    },
    {
        icon: RefreshCcw,
        title: "30-Day Returns",
    },
];

export default function TrustElements() {
    return (
        <div className="
            flex
            justify-center
            gap-8
            py-5
            opacity-70
        ">
            {trustItems.map((item) => {
                const Icon = item.icon;

                return (
                    <div 
                        key={item.title}
                        className="
                            flex
                            flex-col
                            items-center
                            text-center
                            gap-1
                        "
                    >
                        <Icon size={22} className="text-primary" />

                        <span className="
                            text-xs
                            font-semibold
                        ">
                            {item.title}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}