"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { suspendStoreSubscription } from "@/app/platform/subscriptions/actions";

type SuspendStoreFormProps = {
    storeId: string;
    storeName: string;
};

export default function SuspendStoreForm({
    storeId,
    storeName,
}: SuspendStoreFormProps) {
    const [note, setNote] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSuspend() {
        setIsDialogOpen(false);
        setError(null);

        startTransition(async () => {
            const result = await suspendStoreSubscription(storeId, note);

            if (result.error) {
                setError(result.error);
            }
        });
    }

    return (
        <>
            <div className="mt-3 rounded-xl border border-error/20 bg-error-container/15 p-3">
                <label
                    htmlFor={`suspend-note-${storeId}`}
                    className="text-xs font-medium text-on-surface-variant"
                >
                    Internal note — optional
                </label>

                <input
                    id={`suspend-note-${storeId}`}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    maxLength={180}
                    placeholder="e.g. Requested by merchant"
                    className="mt-2 w-full rounded-lg border border-outline/15 bg-white px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:border-primary"
                />

                <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={isPending}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-white px-4 py-3 text-sm font-semibold text-error transition hover:bg-error-container/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? (
                        <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                        <AlertTriangle size={17} />
                    )}

                    {isPending ? "Pausing store…" : "Suspend store"}
                </button>

                {error && (
                    <p className="mt-3 text-center text-xs font-medium text-error">
                        {error}
                    </p>
                )}
            </div>

            <ConfirmationDialog
                isOpen={isDialogOpen}
                title={`Suspend ${storeName}?`}
                description="The merchant storefront will stop being publicly available. You can manage the subscription state again later from Platform."
                cancelLabel="Keep active"
                confirmLabel="Suspend store"
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={handleSuspend}
            />
        </>
    );
}