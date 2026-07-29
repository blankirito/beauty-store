
interface Props {
    orderId: string;
    status: string;
    deliveryDate: string;
}

export default function TrackHeader({
    orderId,
    status,
    deliveryDate,
}:Props) {
    return(
        <section className="
            mb-10
            text-center
        ">
            <p className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-on-surface-variant
            ">
                Order #{orderId}
            </p>

            <h1 className="
                mt-3
                text-4xl
                font-display
                text-black
            ">
                {status}
            </h1>

            <p className="
                mt-3
                text-sm
                text-on-surface-variant
            ">
                Estimated Delivery: {deliveryDate}
            </p>
        </section>
    )
}