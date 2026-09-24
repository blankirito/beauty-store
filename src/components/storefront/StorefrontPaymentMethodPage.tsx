"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import StorefrontNavbar from "@/components/storefront/StorefrontNavbar";
import { saveStorefrontPaymentPreference } from "@/app/store/[slug]/payment-method/actions";
import type { StorefrontPaymentMethod } from "@/lib/storefront/getPublicStorefront";

type StorefrontPaymentMethodPageProps = {
  storeId: string;
  storeName: string;
  storeSlug: string;
  paymentMethods: StorefrontPaymentMethod[];
  initialPaymentMethodId: string;
};

export default function StorefrontPaymentMethodPage({
  storeId,
  storeName,
  storeSlug,
  paymentMethods,
  initialPaymentMethodId,
}: StorefrontPaymentMethodPageProps) {
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    initialPaymentMethodId,
  );
  const [notice, setNotice] = useState("");
  const [isSaving, startSaving] = useTransition();

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedPaymentMethodId,
  );

  function handleSavePreference() {
    if (!selectedPaymentMethodId || !selectedPaymentMethod) {
      return;
    }

    startSaving(async () => {
      const result = await saveStorefrontPaymentPreference({
        storeId,
        storeSlug,
        paymentMethodId: selectedPaymentMethodId,
      });

      if ("error" in result) {
        setNotice(result.error ?? "Could not save your payment preference.");
        return;
      }

      setNotice(
        `${selectedPaymentMethod.label} is now your default payment method.`,
      );
    });
  }

  return (
    <main className="min-h-screen pb-28">
      <StorefrontNavbar
        storeName={storeName}
        homeHref={`/store/${storeSlug}`}
      />

      <section className="mx-auto max-w-md px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Your store account
        </p>

        <h1 className="mt-2 font-display text-4xl text-on-surface">
          Payment Method
        </h1>

        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Choose the payment method to preselect when you checkout at{" "}
          {storeName}.
        </p>

        <div className="mt-8 space-y-3">
          {paymentMethods.map((paymentMethod) => {
            const isSelected =
              paymentMethod.id === selectedPaymentMethodId;

            return (
              <button
                key={paymentMethod.id}
                type="button"
                onClick={() => {
                  setSelectedPaymentMethodId(paymentMethod.id);
                  setNotice("");
                }}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-outline/30 bg-surface-container-lowest"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                  <CreditCard size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-on-surface">
                    {paymentMethod.label}
                  </p>

                  {paymentMethod.instructions && (
                    <p className="mt-1 text-sm leading-5 text-on-surface-variant">
                      {paymentMethod.instructions}
                    </p>
                  )}
                </div>

                {isSelected && (
                  <CheckCircle2
                    size={22}
                    className="shrink-0 text-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {paymentMethods.length === 0 && (
          <p className="mt-8 rounded-xl bg-error-container p-4 text-sm text-error">
            This store has no payment method available yet.
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-primary-container/25 p-4 text-sm text-on-surface"
          >
            {notice}
          </p>
        )}
      </section>

      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-outline/30 bg-surface-container-lowest p-5">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            disabled={!selectedPaymentMethodId || isSaving}
            onClick={handleSavePreference}
            className="w-full rounded-xl bg-primary py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-outline"
          >
            {isSaving ? "Saving..." : "Save preference"}
          </button>
        </div>
      </div>
    </main>
  );
}