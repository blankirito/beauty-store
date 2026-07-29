interface Props {
    id: number;
    image: string;
    name: string;
    variant: string;
    quantity: number;
    price: number;
}

export default function OrderItem({
    id,
    image,
    name,
    variant,
    quantity,
    price,
}:Props) {
    return (
        <div className="
            flex
            gap-6
            p-4
            rounded-xl
            transition
        ">

            <div className="
                w-24
                h-24
                rounded-lg
                overflow-hidden
                bg-surface-container
                shrink-0
            ">
                <img
                    src={image}
                    alt={name}
                    className="
                        w-full
                        h-full
                        object-cover
                    "
                />
            </div>

            <div className="
                flex-1
                flex
                flex-col
                justify-between
                py-1
                min-w-0
            ">
                <div>
                    <h4 className="
                        font-semibold
                        text-on-surface
                        truncate
                    ">
                        {name}
                    </h4>

                    <p className="
                        mt-1
                        text-sm
                        text-on-surface-variant
                    ">
                        {variant}
                    </p>
                </div>
                <div className="
                    flex
                    justify-between
                    items-end
                    mt-4
                ">
                    <span className="
                        text-sm
                        text-on-surface-variant
                    ">
                        Qty: {quantity}
                    </span>

                    <span className="
                        font-semibold
                        text-on-surface
                    ">
                        RM{price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    )
}