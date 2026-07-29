import { CreditCard } from "lucide-react";

interface Props {
    method: string;
    description: string;
}

export default function PaymentInfo({
    method,
    description,
}: Props) {
    return (
        <section>
        <h3 className="
            text-sm
            uppercase
            tracking-widest
            font-semibold
            mb-4
            flex
            items-center
            gap-2
        ">
            <CreditCard size={18}/>
            Payment Method
        </h3>

        <div className="
            flex
            items-start
            gap-3
        ">
            <div className="
                p-2
                rounded-lg
                bg-surface-container
            ">
                <CreditCard size={25} />
            </div>

            <div>
                <p className="
                    font-medium
                    text-on-surface
                ">
                    {method}
                </p>

                <p className="
                    text-sm
                    text-on-surface-variant
                    mt-1
                ">
                    {description}
                </p>
            </div>
        </div>
    </section>
    )
}
    