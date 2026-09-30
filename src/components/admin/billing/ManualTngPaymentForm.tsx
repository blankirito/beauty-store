"use client";

import { useActionState, useState } from "react";
import { Check, ChevronDown, Loader2, Send } from "lucide-react";
import {
  MANUAL_PAYMENT_DURATIONS,
  getManualPaymentQuote,
} from "@/lib/merchants/manualSubscriptionPayment";
import type { MerchantPlanCode } from "@/lib/merchants/merchantBilling";
import {
  submitManualTngPaymentRequest,
  type ManualPaymentRequestState,
} from "@/app/admin/billing/actions";

const initialState: ManualPaymentRequestState = {};

type Props = {
  planCode: MerchantPlanCode;
  foundingPriceLockedUntil: string | null;
  recipientName: string;
  recipientNumber: string;
  hasPendingRequest: boolean;
};

export default function ManualTngPaymentForm(props: Props) {
  const [months, setMonths] = useState(1);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    submitManualTngPaymentRequest,
    initialState,
  );

  const quote = getManualPaymentQuote({
    planCode: props.planCode,
    foundingPriceLockedUntil: props.foundingPriceLockedUntil,
    months,
  });

  if (props.hasPendingRequest) {
    return (
      <div className="mt-6 rounded-xl bg-secondary-container/45 p-4 text-sm text-on-secondary-container">
        Your TNG payment request is awaiting Lumina Admin review.
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4 rounded-xl bg-surface-container-low p-4">
      <div>
        <p className="font-semibold text-on-surface">Pay via TNG transfer</p>
        <p className="mt-1 text-sm text-on-surface-variant">
          Transfer to {props.recipientName} · {props.recipientNumber}
        </p>
      </div>

      <input type="hidden" name="months" value={months} />

      <div className="relative">
        <span className="text-sm font-medium text-on-surface">
          Subscription period
        </span>

        <button
          type="button"
          onClick={() => setIsPeriodOpen((current) => !current)}
          className="mt-2 flex w-full items-center justify-between rounded-xl border border-outline/25 bg-white px-3.5 py-3 text-left text-sm text-on-surface"
          aria-haspopup="listbox"
          aria-expanded={isPeriodOpen}
        >
          <span>
            {months} month{months === 1 ? "" : "s"} · RM{" "}
            {quote.totalAmount.toFixed(2)}
          </span>
          <ChevronDown
            size={18}
            className={`text-primary transition ${isPeriodOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isPeriodOpen ? (
          <>
            <button
              type="button"
              aria-label="Close subscription period menu"
              onClick={() => setIsPeriodOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />

            <div
              role="listbox"
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-outline/20 bg-surface p-1.5 shadow-lg"
            >
              {MANUAL_PAYMENT_DURATIONS.map((duration) => {
                const isSelected = months === duration;
                const optionQuote = getManualPaymentQuote({
                  planCode: props.planCode,
                  foundingPriceLockedUntil: props.foundingPriceLockedUntil,
                  months: duration,
                });

                return (
                  <button
                    key={duration}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setMonths(duration);
                      setIsPeriodOpen(false);
                    }}
                    className={
                      isSelected
                        ? "flex w-full items-center justify-between rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white"
                        : "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-on-surface transition hover:bg-surface-low"
                    }
                  >
                    {duration} month{duration === 1 ? "" : "s"} · RM{" "}
                    {optionQuote.totalAmount.toFixed(2)}
                    {isSelected ? <Check size={17} /> : null}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>

      <p className="rounded-xl bg-white px-3 py-3 text-sm text-on-surface">
        Amount to transfer:{" "}
        <span className="font-semibold">RM {quote.totalAmount.toFixed(2)}</span>
      </p>

      <label className="block text-sm font-medium text-on-surface">
        Transfer payer name
        <input name="payerName" required maxLength={120} className="mt-2 w-full rounded-xl border border-outline/20 bg-white px-3 py-3" />
      </label>

      <label className="block text-sm font-medium text-on-surface">
        TNG transfer reference
        <input name="tngReference" required maxLength={120} className="mt-2 w-full rounded-xl border border-outline/20 bg-white px-3 py-3" />
      </label>

      <label className="block text-sm font-medium text-on-surface">
        Note <span className="font-normal text-on-surface-variant">(optional)</span>
        <textarea name="note" maxLength={500} rows={3} className="mt-2 w-full rounded-xl border border-outline/20 bg-white px-3 py-3" />
      </label>

      {state.error ? <p className="text-sm text-error">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}

      <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-60">
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        Submit TNG payment request
      </button>
    </form>
  );
}