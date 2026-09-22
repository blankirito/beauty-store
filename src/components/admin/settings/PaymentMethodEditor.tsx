"use client";

import {
  Banknote,
  Building2,
  ChevronDown,
  CircleCheck,
  CirclePlus,
  CircleX,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import {
  createStorePaymentMethod,
  updateStorePaymentMethod,
} from "@/app/admin/settings/payments/actions";
import { getNextExpandedPaymentMethodId } from "@/lib/payments/paymentMethodExpansion";
import type { StorePaymentMethod } from "@/lib/payments/storePaymentMethod";

type PaymentMethodEditorProps = {
  paymentMethods: StorePaymentMethod[];
};

function getPaymentMethodIcon(code: string) {
  return code === "bank_transfer" ? Building2 : Banknote;
}

function AddPaymentMethodForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createStorePaymentMethod({
        label,
        instructions,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.refresh();
      onClose();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-primary/20 bg-surface-container-lowest p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-on-surface">
            Add payment method
          </p>
          <p className="mt-1 text-xs leading-5 text-on-surface-variant">
            Add an offline method such as DuitNow, Touch ’n Go, or in-store
            payment.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel adding payment method"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container"
        >
          <X size={17} />
        </button>
      </div>

      <label className="mt-5 block">
        <span className="text-xs font-medium text-on-surface">
          Customer-facing name
        </span>

        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Example: DuitNow Transfer"
          className="mt-2 h-11 w-full rounded-xl border border-outline/20 bg-surface px-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-on-surface">
          Customer instructions
        </span>

        <textarea
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          rows={3}
          placeholder="Explain how the customer should pay."
          className="mt-2 w-full resize-none rounded-xl border border-outline/20 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <CirclePlus size={17} />
        )}

        {isPending ? "Adding..." : "Add payment method"}
      </button>

      {error && (
        <p className="mt-3 text-center text-xs font-medium text-error">
          {error}
        </p>
      )}
    </form>
  );
}

type PaymentMethodCardProps = {
  paymentMethod: StorePaymentMethod;
  isExpanded: boolean;
  onToggle: () => void;
  onCollapse: () => void;
};

function PaymentMethodCard({
  paymentMethod,
  isExpanded,
  onToggle,
  onCollapse,
}: PaymentMethodCardProps) {
  const router = useRouter();
  const [label, setLabel] = useState(paymentMethod.label);
  const [instructions, setInstructions] = useState(
    paymentMethod.instructions ?? "",
  );
  const [isEnabled, setIsEnabled] = useState(paymentMethod.isEnabled);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const Icon = getPaymentMethodIcon(paymentMethod.code);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateStorePaymentMethod({
        paymentMethodId: paymentMethod.id,
        label,
        instructions,
        isEnabled,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.refresh();
      onCollapse();
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-surface-container-low"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/30 text-primary">
          <Icon size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-on-surface">
            {paymentMethod.label}
          </p>

          <p className="mt-1 text-xs text-on-surface-variant">
            {paymentMethod.isEnabled
              ? "Available at checkout"
              : "Not available at checkout"}
          </p>
        </div>

        <span
          className={
            paymentMethod.isEnabled
              ? "inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-container/40 px-2 py-1 text-[10px] font-semibold text-on-primary-container"
              : "inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-container px-2 py-1 text-[10px] font-semibold text-on-surface-variant"
          }
        >
          {paymentMethod.isEnabled ? (
            <CircleCheck size={12} />
          ) : (
            <CircleX size={12} />
          )}
          {paymentMethod.isEnabled ? "Enabled" : "Disabled"}
        </span>

        <ChevronDown
          size={18}
          className={
            isExpanded
              ? "shrink-0 rotate-180 text-on-surface-variant transition-transform"
              : "shrink-0 text-on-surface-variant transition-transform"
          }
        />
      </button>

      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border-t border-outline/15 px-4 pb-4 pt-5"
        >
          <label className="block">
            <span className="text-xs font-medium text-on-surface">
              Customer-facing name
            </span>

            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-outline/20 bg-surface px-3 text-sm text-on-surface outline-none transition focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-on-surface">
              Customer instructions
            </span>

            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              rows={3}
              placeholder="Explain how the customer should pay."
              className="mt-2 w-full resize-none rounded-xl border border-outline/20 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-low px-3 py-3">
            <span>
              <span className="block text-sm font-semibold text-on-surface">
                Available at checkout
              </span>
              <span className="mt-0.5 block text-xs text-on-surface-variant">
                Customers can select this method.
              </span>
            </span>

            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(event) => setIsEnabled(event.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {isPending ? "Saving..." : "Save changes"}
          </button>

          {error && (
            <p className="text-center text-xs font-medium text-error">
              {error}
            </p>
          )}
        </form>
      )}
    </article>
  );
}

export default function PaymentMethodEditor({
  paymentMethods,
}: PaymentMethodEditorProps) {
  const [expandedPaymentMethodId, setExpandedPaymentMethodId] = useState<
    string | null
  >(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <section className="space-y-3">
      {paymentMethods.map((paymentMethod) => (
        <PaymentMethodCard
          key={paymentMethod.id}
          paymentMethod={paymentMethod}
          isExpanded={expandedPaymentMethodId === paymentMethod.id}
          onToggle={() =>
            setExpandedPaymentMethodId(
              getNextExpandedPaymentMethodId(
                expandedPaymentMethodId,
                paymentMethod.id,
              ),
            )
          }
          onCollapse={() => setExpandedPaymentMethodId(null)}
        />
      ))}

      {isAdding ? (
        <AddPaymentMethodForm onClose={() => setIsAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/35 bg-primary-container/15 px-4 py-4 text-sm font-semibold text-primary transition hover:bg-primary-container/30"
        >
          <CirclePlus size={19} />
          Add payment method
        </button>
      )}
    </section>
  );
}