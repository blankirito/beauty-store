"use client";

import PaymentCard from "./PaymentCard";
import AddCardButton from "./AddCardButton";

const cards = [
  {
    id: "card_1",
    brand: "VISA",
    cardNumber: "•••• •••• •••• 4242",
    holder: "Alex Morgan",
    expiry: "12/28",
  },
  {
    id: "card_2",
    brand: "MC",
    cardNumber: "•••• •••• •••• 8891",
    holder: "Alex Morgan",
    expiry: "08/28",
  },
];

type SavedCardsProps = {
  selectedPaymentId: string;
  onSelect: (paymentId: string) => void;
  onAddCard: () => void;
};

export default function SavedCards({
  selectedPaymentId,
  onSelect,
  onAddCard,
}: SavedCardsProps) {
  return (
    <section className="space-y-6">
      <h2 className="font-display text-2xl text-primary">Saved Cards</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <PaymentCard
            key={card.id}
            brand={card.brand}
            cardNumber={card.cardNumber}
            holder={card.holder}
            expiry={card.expiry}
            isSelected={selectedPaymentId === card.id}
            onClick={() => onSelect(card.id)}
          />
        ))}

        <AddCardButton onClick={onAddCard} />
      </div>
    </section>
  );
}