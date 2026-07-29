"use client";

import { useState } from "react";

import PaymentCard from "./PaymentCard";
import AddCardButton from "./AddCardButton";

const cards = [
    {
        id: "card_1",
        brand: "VISA",
        cardNumber: "•••• •••• •••• 4242",
        holder: "Evelyn Rose",
        expiry: "12/26",
    },

    {
        id: "card_2",
        brand: "MC",
        cardNumber: "•••• •••• •••• 8891",
        holder: "Evelyn Rose",
        expiry: "08/25",
    },
];

export default function SavedCard() {

    const [defaultCard, setDefaultCard] = useState("card_1");
    
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
                {
                    cards.map((card)=>(
                        <PaymentCard
                            key={card.id}
                            brand={card.brand}
                            cardNumber={card.cardNumber}
                            holder={card.holder}
                            expiry={card.expiry}

                            isDefault={
                                defaultCard === card.id
                            }

                            onClick={() =>
                                setDefaultCard(card.id)
                            }
                        />
                    ))
                }

                <AddCardButton />
            </div>
        </section>
    )
}