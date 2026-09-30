"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { reviewManualPaymentRequest } from "@/app/platform/subscriptions/actions";

type Props = {
  requestId: string;
  requestedMonths: number;
};

const periods = [1, 3, 12];

export default function PaymentRequestReviewForm({
  requestId,
  requestedMonths,
}: Props) {
  const [months, setMonths] = useState(requestedMonths);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function review(decision: "approve" | "reject") {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("decision", decision);
      formData.set("months", String(months));
      formData.set("reviewNote", reason);

      const result = await reviewManualPaymentRequest(requestId, formData);
      setError(result.error ?? null);
    });
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl bg-surface-container-low p-3">
      <div className="relative">
        <span className="text-xs font-medium text-on-surface-variant">
          Approved period
        </span>

        <button
          type="button"
          onClick={() => setIsPeriodOpen((current) => !current)}
          className="mt-2 flex w-full items-center justify-between rounded-lg border border-outline/20 bg-white px-3 py-2 text-left text-sm text-on-surface"
          aria-haspopup="listbox"
          aria-expanded={isPeriodOpen}
        >
          <span>
            {months} month{months === 1 ? "" : "s"}
          </span>

          <ChevronDown
            size={17}
            className={`text-primary transition ${
              isPeriodOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isPeriodOpen ? (
          <>
            <button
              type="button"
              aria-label="Close approved period menu"
              onClick={() => setIsPeriodOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />

            <div
              role="listbox"
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-outline/20 bg-surface p-1.5 shadow-lg"
            >
              {periods.map((period) => {
                const isSelected = months === period;

                return (
                  <button
                    key={period}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setMonths(period);
                      setIsPeriodOpen(false);
                    }}
                    className={
                      isSelected
                        ? "flex w-full items-center justify-between rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white"
                        : "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-on-surface transition hover:bg-surface-low"
                    }
                  >
                    {period} month{period === 1 ? "" : "s"}
                    {isSelected ? <Check size={17} /> : null}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>

      <label className="block text-xs font-medium text-on-surface-variant">
        Rejection reason — required only when rejecting
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={500}
          className="mt-2 w-full rounded-lg border border-outline/20 bg-white px-3 py-2 text-sm text-on-surface"
        />
      </label>

      {error ? <p className="text-xs text-error">{error}</p> : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => review("approve")}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Check size={16} />
          Approve
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => review("reject")}
          className="flex items-center justify-center gap-2 rounded-lg border border-error/30 bg-error-container/40 px-3 py-2.5 text-sm font-semibold text-error disabled:opacity-60"
        >
          <X size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}