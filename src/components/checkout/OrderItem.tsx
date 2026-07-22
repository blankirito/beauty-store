interface Props {
    image: string,
    title: string,
    price: number,
    quantity: number,
    variant: string;
}

import Image from "next/image";

export default function OrderItem({
    image,
    title,
    price,
    quantity,
    variant,
}: Props) {
    return (
        <div className="
            flex
            gap-4
        ">
            <div className="
                w-20
                h-20
                rounded-lg
                overflow-hidden
                bg-white
                shrink-0
            ">
                <img
                    src={image}
                    alt={title}
                    width={80}
                    height={80}
                    className="
                        w-full
                        h-full
                        object-cover
                    "
                />
            </div>

            <div className="flex-1">
                <div className="
                    flex
                    justify-between
                    items-start
                ">
                    <p className="
                        font-semibold
                        text-base
                        leading-tight
                    ">
                        {title}
                    </p>

                    <p className="
                        font-bold
                        text-base
                    ">
                        RM{price.toFixed(2)}
                    </p>
                </div>

                <p className="
                    mt-1
                    text-sm
                    text-on-surface-variant
                ">
                    Qty: {quantity} · {variant}
                </p>
            </div>
        </div>
    )
}