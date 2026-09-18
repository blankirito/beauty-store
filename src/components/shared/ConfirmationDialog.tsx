import { AlertTriangle } from "lucide-react";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmationDialog({
  isOpen,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end bg-on-surface/35 p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
    >
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={onCancel}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-5 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error-container text-error">
          <AlertTriangle size={21} />
        </div>

        <h2
          id="confirmation-dialog-title"
          className="mt-4 font-display text-2xl text-on-surface"
        >
          {title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          {description}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-outline/25 bg-surface text-sm font-semibold text-on-surface transition hover:bg-surface-container"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-error text-sm font-semibold text-white transition hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}