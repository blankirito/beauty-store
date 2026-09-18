"use client";

import { CreditCard, Wallet } from "lucide-react";
import { useState } from "react";

type PaymentType = "card" | "paypal";

export default function PaymentMethod() {
  const [payment, setPayment] = useState<PaymentType>("card");

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0px_4px_12px_rgba(132,81,69,0.05)]">
      <h2 className="mb-5 font-display text-lg font-semibold text-on-surface">
        Payment Method
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          aria-pressed={payment === "card"}
          onClick={() => setPayment("card")}
          className={
            payment === "card"
              ? "flex items-center gap-3 rounded-xl border border-primary bg-primary-fixed/20 p-4 text-left transition"
              : "flex items-center gap-3 rounded-xl border border-outline p-4 text-left transition hover:border-primary/60"
          }
        >
          <CreditCard size={20} className="text-on-surface-variant" />

          <span className="text-sm font-semibold text-on-surface">
            Credit Card
          </span>
        </button>

        <button
          type="button"
          aria-pressed={payment === "paypal"}
          onClick={() => setPayment("paypal")}
          className={
            payment === "paypal"
              ? "flex items-center gap-3 rounded-xl border border-primary bg-primary-fixed/20 p-4 text-left transition"
              : "flex items-center gap-3 rounded-xl border border-outline p-4 text-left transition hover:border-primary/60"
          }
        >
          <Wallet size={20} className="text-on-surface-variant" />

          <span className="text-sm font-semibold text-on-surface">
            PayPal
          </span>
        </button>
      </div>

      {payment === "card" && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="card-number"
              className="text-xs font-semibold text-on-surface-variant"
            >
              Card Number
            </label>

            <input
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              className="w-full rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="card-expiry"
                className="text-xs font-semibold text-on-surface-variant"
              >
                Expiry Date
              </label>

              <input
                id="card-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="card-cvc"
                className="text-xs font-semibold text-on-surface-variant"
              >
                CVC
              </label>

              <input
                id="card-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {payment === "paypal" && (
        <p className="mt-6 rounded-lg bg-surface-container p-4 text-sm leading-relaxed text-on-surface-variant">
          You will be redirected to PayPal to complete your payment after
          placing the order.
        </p>
      )}
    </section>
  );
}