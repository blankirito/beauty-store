import PaymentCard from "./PaymentCard";
import AddCardButton from "./AddCardButton";

export default function SavedCard() {
    return (
        <section className="
            space-y-6
        ">
            <h2 className="
                text-2xl
                font-display
                text-primary
            ">
                Saved Cards
            </h2>

            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
            ">
                <PaymentCard
                    brand="VISA"
                    cardNumber="•••• •••• •••• 4242"
                    holder="Alex Morgan"
                    expiry="11/26"
                    isDefault
                />
                <PaymentCard
                    brand="MC"
                    cardNumber="•••• •••• •••• 5498"
                    holder="Alex Morgan"
                    expiry="1/27"
                />

                <AddCardButton />
            </div>
        </section>
    )
}