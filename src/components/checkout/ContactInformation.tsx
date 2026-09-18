"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

export default function ContactInformation() {
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("+60 12-345 6789");

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0px_4px_12px_rgba(132,81,69,0.05)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-on-surface">
          Contact Information
        </h2>

        <Mail size={20} className="text-outline" />
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="checkout-email"
          className="text-xs font-semibold tracking-wide text-on-surface-variant"
        >
          Email Address
        </label>

        <input
          id="checkout-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="checkout-phone"
          className="text-xs font-semibold tracking-wide text-on-surface-variant"
        >
          Phone Number
        </label>

        <input
          id="checkout-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
        />
      </div>
    </section>
  );
}