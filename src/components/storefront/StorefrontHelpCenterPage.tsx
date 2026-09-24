"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import Link from "next/link";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";

type StorefrontHelpCenterPageProps = {
  storeName: string;
  storeSlug: string;
  supportEmail: string;
};

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "Open Orders from your profile, then select an order to see its latest delivery updates and tracking details.",
  },
  {
    question: "Which payment method will be used at checkout?",
    answer:
      "The store’s available payment methods are shown at checkout. You can save your preferred option in Payment Method for faster checkout next time.",
  },
  {
    question: "How do I use a saved delivery address?",
    answer:
      "Save an address in Saved Addresses, then choose it during checkout. You can still edit the delivery details for that order.",
  },
  {
    question: "Can I update my account details?",
    answer:
      "Yes. In Settings, you can update your name and phone number, change your password, or securely request an email change.",
  },
];

export default function StorefrontHelpCenterPage({
  storeName,
  storeSlug,
  supportEmail,
}: StorefrontHelpCenterPageProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader storeName={storeName} storeSlug={storeSlug} />

      <section className="mx-auto max-w-xl px-5 pt-9">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary">
          SUPPORT
        </p>

        <h1 className="mt-2 font-display text-4xl text-primary">
          Help Center
        </h1>

        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Find quick answers and manage the details of your order.
        </p>

        <section className="mt-8">
          <h2 className="font-display text-3xl text-primary">
            Common Questions
          </h2>

          <div className="mt-4 space-y-3">
            {faqs.map((faq) => {
              const isOpen = openQuestion === faq.question;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl bg-surface shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion((current) =>
                        current === faq.question ? null : faq.question,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-on-surface">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-primary transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="border-t border-outline/20 px-5 py-4 text-sm leading-6 text-on-surface-variant">
                      {faq.answer}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-primary p-6 text-white">
          <Mail size={24} />

          <h2 className="mt-5 font-display text-3xl">Need more help?</h2>

          <p className="mt-2 text-sm leading-6 text-white/80">
            Send us an email and include your order number if your question is
            about an order.
          </p>

          <a
            href={`mailto:${supportEmail}?subject=${encodeURIComponent(
              `Help request for ${storeName}`,
            )}`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-surface-low"
          >
            <Mail size={18} />
            Email Support
          </a>
        </section>
      </section>
    </main>
  );
}