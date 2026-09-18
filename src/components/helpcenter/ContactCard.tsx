"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

export default function ContactCard() {
  const [notice, setNotice] = useState("");

  return (
    <div className="flex flex-col justify-center rounded-2xl border border-outline/20 bg-surface-low p-10">
      <h3 className="mb-8 text-center font-display text-2xl text-primary">
        Contact Our Concierge
      </h3>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() =>
            setNotice(
              "Email support will be connected after your official support email is ready.",
            )
          }
          className="flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 text-white transition hover:opacity-90"
        >
          <Mail size={20} />
          Email Support
        </button>

        <button
          type="button"
          onClick={() =>
            setNotice(
              "Live Chat will be available after a customer-support service is connected.",
            )
          }
          className="flex w-full items-center justify-center gap-3 rounded-full border border-outline/30 bg-surface py-4 text-primary transition hover:bg-primary-container/20"
        >
          <MessageCircle size={20} />
          Live Chat
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-primary-container/20 p-3 text-center text-sm text-on-surface-variant"
        >
          {notice}
        </p>
      )}

      <p className="mt-8 text-center text-sm italic text-on-surface-variant">
        Response time: Typically within 24 hours
      </p>
    </div>
  );
}