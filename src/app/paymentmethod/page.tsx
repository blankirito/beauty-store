"use client";

import { useState } from "react";
import Navbar2 from "@/components/shared/Navbar2";
import PaymentHeader from "@/components/paymentmethod/PaymentHeader";
import SavedCards from "@/components/paymentmethod/SavedCards";
import OtherPaymentMethods from "@/components/paymentmethod/OtherPaymentMethods";
import SavePreferenceButton from "@/components/paymentmethod/SavePreferenceButton";

const paymentLabels: Record<string, string> = {
  card_1: "Visa ending in 4242",
  card_2: "Mastercard ending in 8891",
  "Apple Pay": "Apple Pay",
  PayPal: "PayPal",
  "Online Banking": "Online Banking",
};

export default function PaymentMethodPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState("card_1");
  const [notice, setNotice] = useState("");

  function handleAddCard() {
    setNotice(
      "Adding cards will be available after the secure payment provider is connected.",
    );
  }

  function handleSavePreference() {
    setNotice(
      `${paymentLabels[selectedPaymentId]} is selected for this session. It will be saved to your account after the backend is connected.`,
    );
  }

  return (
    <main className="pb-32">
      <Navbar2 />
      <PaymentHeader />

      <section className="mx-auto max-w-6xl space-y-12 px-5">
        <SavedCards
          selectedPaymentId={selectedPaymentId}
          onSelect={setSelectedPaymentId}
          onAddCard={handleAddCard}
        />

        <OtherPaymentMethods
          selectedPaymentId={selectedPaymentId}
          onSelect={setSelectedPaymentId}
        />

        {notice && (
          <p
            role="status"
            className="rounded-xl bg-primary-container/25 p-4 text-sm text-on-surface"
          >
            {notice}
          </p>
        )}
      </section>

      <SavePreferenceButton
        selectedLabel={paymentLabels[selectedPaymentId]}
        onSave={handleSavePreference}
      />
    </main>
  );
}