import { Truck, RotateCcw } from "lucide-react";

type OrderItemProps = {
    id: number,
    name: string,
    price: number,
    quantity: number,
    image: string,
}

export default function OrderCard({
    id, 
    name,
    price,
    quantity,
    image,
}: OrderItemProps) {
    return (
        <div className="
            bg-surface
            rounded-xl
            p-4
            shadow-sm
            space-y-4
        ">
            {/* header */}
            <div className="
                flex
                justify-between
                items-start
            ">
                <div>
                    <p className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-on-surface-variant
                    ">Order #{id}</p>
                    <p className="
                        text-sm
                        text-outline
                        mt-1
                    ">
                        placed on Oct 24, 2026
                    </p>
                </div>

                <span className="
                    px-3
                    py-1
                    rounded-full
                    bg-primary-container
                    text-primary
                    text-xs
                    font-semibold
                ">
                    In Transit
                </span>
            </div>

            {/* product */}
            <div className="
                flex
                items-center
                gap-4
            ">
                <div className="
                    relative
                    w-20
                    h-20
                    rounded-lg
                    overflow-hidden
                    flex-shrink-0
                ">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="
                    flex-1
                    min-w-0
                ">
                    <h3 className="
                        font-display
                        text-lg
                        text-primary
                        font-medium
                        truncate
                    ">
                        {name}
                    </h3>

                    <p className="
                        text-sm
                        text-on-surface-variant
                        mt-1
                    ">
                        Qty: {quantity}
                    </p>
                </div>

                <div className="
                    text-lg
                    font-bold
                    text-primary
                ">
                    RM{price.toFixed(2)}
                </div>
            </div>
            
            {/* footer */}
            <div className="
                border-t
                border-outline
                pt-4
                flex
                gap-3
            ">
                <button className="
                    flex-1
                    h-12
                    rounded-xl
                    bg-primary
                    text-white
                    flex
                    items-center
                    justify-center
                    gap-2
                    font-semibold
                ">
                    <Truck size={18} />
                    Track Order
                </button>

                <button className="
                    h-12
                    px-5
                    rounded-xl
                    border-2
                    border-primary
                    text-primary
                    flex
                    items-center
                    justify-center
                    gap-2
                    font-semibold
                ">
                    Details
                </button>
            </div>
        </div>
    )
}