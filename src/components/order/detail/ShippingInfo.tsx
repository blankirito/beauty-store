import { Truck } from "lucide-react";

interface Props {
    name: string;
    address: string[];
}

export default function ShippingInfo({
    name, 
    address,
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
                <Truck size={18} />
                Shipping To
            </h3>

            <address    
                className="
                    not-italic
                    text-medium
                    text-on-surface-variant
                    space-y-1
                "
            >
                <p className="
                    font-medium
                    text-on-surface
                ">
                    {name}
                </p>
                {
                    address.map((line, index)=>(
                        <p key={index}>
                            {line}
                        </p>
                    ))
                }
            </address>
        </section>
    )
}