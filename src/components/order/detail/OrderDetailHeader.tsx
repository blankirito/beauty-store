import { CheckCircle2 } from "lucide-react";

interface Props {
    orderId: string;
    date: string;
    status: string;
}

export default function OrderDetailHeader({
    orderId,
    date,
    status,
}:Props) {
    return (
        <section className="
            mb-10
            text-center
        ">
            <h1 className="
                text-3xl
                md-text-4xl
                font-display
                text-on-surface
                mb-3
            ">
                Order #{orderId}
            </h1>

            <div className="
                flex
                items-center
                justify-center
                md:justify-start
                gap-2
                text-sm
                text-on-surface-variant
            ">
                <span>
                    Placed on {date}
                </span>

                <span className="
                    w-1
                    h-1
                    rounded-full
                    bg-surface-container-highest
                "/>

                <span className="
                    flex
                    items-center
                    gap-1
                    text-primary
                    font-medium
                ">
                    <CheckCircle2
                        size={16}
                        className="fill-primary text-white"
                    />
                    {status}
                </span>
            </div>
        </section>
    )
}