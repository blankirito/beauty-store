

export default function CartHeader() {
    return (
        <section className="
            px-5
            py-6
            flex
            items-center
            justify-between
        ">
            <h2 className="
                text-2xl
                font-display
                font-medium
                text-foreground
            ">
                Your Cart (3)
            </h2>

            <button className="
                text-sm
                font-semibold
                text-primary
            ">
                Select All
            </button>
    </section>
    )
}