import React from "react";

type QuantitySelectorProps = {
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
};

export default function QuantitySelector({
    quantity,
    setQuantity,
}: QuantitySelectorProps) {
    return (
        <section className="
            px-5
            mt-6
            flex
            items-center
            justify-between
            py-4
            border-y
            border-surface-low
        ">
            <span className="
                text-sm
                font-semibold
                uppercase
                tracking-wider
                text-on-surface-variant
            ">Quantity</span>

            <div className="
                flex
                items-center
                bg-surface-low
                rounded-full
                px-2
                py-1
            ">
                <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev-1))}
                    className="
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                        text-primary
                        text-xl
                    "
                >-
                </button>

                <span className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-center
                    font-semibold
                    text-primary
                ">
                    {quantity}
                </span>

                <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                        text-primary
                        text-xl
                    "
                >+</button>
            </div>
        </section>
    );
}