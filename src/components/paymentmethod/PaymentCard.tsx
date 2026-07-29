
interface Props {
    brand: string;
    cardNumber: string;
    holder: string;
    expiry: string;
    isDefault?: boolean;
}

export default function PaymentCard({
    brand,
    cardNumber,
    holder,
    expiry,
    isDefault = false,
}: Props) {
    return (
        <div className={`
            bg-surface-container-lowest
            rounded-xl
            p-6
            relative
            cursor-pointer
            transition
            ${
                isDefault
                ?
                "border-2 border-primary-container shadow-[0_4px_24px_rgba(232,167,152,0.08)]"
                :
                "border border-outline hover:shadow-[0_8px_32px_rgba(232,167,152,0.15)]"
            }    
        `}>
            {
                isDefault && (
                    <div className="
                        absolute
                        top-4
                        right-4
                        bg-primary-container
                        text-on-primary-container
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                    ">
                        Default
                    </div>
                )
            }

            <div className="
                flex
                justify-between
                items-start
                mb-8
            ">
                <div className="
                    w-12
                    h-8
                    bg-surface-container
                    flex
                    items-center
                    justify-center
                    rounded
                ">
                    <span className="
                        text-sm
                        font-semibold
                        text-primary
                    ">
                        {brand}
                    </span>
                </div>
            </div>

            <div className="
                space-y-4
            ">
                <div className="
                    text-lg
                    tracking-widest
                    text-on-surface
                ">
                    {cardNumber}
                </div>

                <div className="
                    flex
                    justify-between
                    text-on-surface-variant
                    text-sm
                    font-semibold
                    uppercase
                ">
                    <span>{holder}</span>
                    <span>{expiry}</span>
                </div>
            </div>
        </div>
    )
}