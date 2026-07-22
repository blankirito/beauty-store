

export default function OrderDetail() {
    return (
        <div className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            border
            border-outline/30
            shadow-sm
        ">
            <div className="
                flex
                flex-col
                md:flex-row
                justify-between
                items-center
                gap-6
            ">
                <div className="
                    text-left
                    w-full
                ">
                    <p className="
                        text-xs
                        uppercase
                        text-on-surface-variant
                    ">Order Number</p>

                    <p className="
                        text-xl
                        font-display
                        text-primary
                    ">
                        #BTQ-102938
                    </p>
                </div>

                <div className="
                    hidden
                    md:block
                    h-12
                    w-px
                    bg-outline
                "/>

                <div className="text-left w-full">
                    <p className="
                        text-xs
                        uppercase
                        text-on-surface-variant
                    ">Estimated Delivery</p>

                    <p className="
                        text-xl
                        font-display
                        text-primary
                    ">
                        Oct 24, 2026
                    </p>
                </div>
            </div>
        </div>
    )
}