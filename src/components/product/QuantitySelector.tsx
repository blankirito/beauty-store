

export default function QuantitySelector() {
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
                <button className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-primary
                    text-xl
                ">-</button>

                <span className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-center
                    font-semibold
                    text-primary
                ">1</span>

                <button className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-primary
                    text-xl
                ">+</button>
            </div>
        </section>
    );
}