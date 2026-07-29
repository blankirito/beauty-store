import { LucideIcon } from "lucide-react";

interface Props {
    name: string;
    icon: LucideIcon;
    selected: boolean;
    onClick:()=>void;
}

export default function PaymentMethodItem({
    name,
    icon: Icon,
    selected,
    onClick,
}: Props) {
    return (
        <button
            onClick={onClick}
            className="
                w-full
                flex
                items-center
                justify-between
                p-5
                transition
                hover:bg-surface-low
                border-b
                border-outline/30
            "
        >
            <div className="
                flex
                items-center
                gap-4
            ">
                    <div className={`
                        w-10
                        h-10
                        rounded-full
                        flex
                        items-center
                        justify-center
                        transition
                        ${
                            selected
                            ?
                            "bg-primary-container text-primary"
                            :
                            "bg-surface-container text-on-surface"
                        }
                    `}>
                        <Icon size={20}/>
                    </div>

                    <span className="
                        text-on-surface
                        font-medium
                    ">
                        {name}
                    </span>
            </div>

            <div className={`
                w-5
                h-5
                rounded-full
                border-2
                flex
                items-center
                justify-center
                ${
                    selected
                    ?
                    "border-primary"
                    :
                    "border-outline"
                }
            `}
            >
                {
                    selected && (
                        <div className="
                            w-2.5
                            h-2.5
                            rounded-full
                            bg-primary
                        "/>
                    )
                }
            </div>
        </button>
    )
}