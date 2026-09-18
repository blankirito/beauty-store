"use client";

import { Mail, Send, X } from "lucide-react";
import { useState } from "react";

type SendEmailDialogProps = {
  isOpen: boolean;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
  onSend: () => void;
};

export default function SendEmailDialog({
  isOpen,
  customerName,
  customerEmail,
  onClose,
  onSend,
}: SendEmailDialogProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) {
    return null;
  }

  function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // UI stage only — actual email delivery comes with backend.
    onSend();
    setSubject("");
    setMessage("");
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end bg-on-surface/35 p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-dialog-title"
    >
      <button
        type="button"
        aria-label="Close email dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <form
        onSubmit={handleSend}
        className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-primary">
            <Mail size={21} />
          </div>

          <button
            type="button"
            aria-label="Close email dialog"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="email-dialog-title"
          className="mt-4 font-display text-2xl text-on-surface"
        >
          Send Email
        </h2>

        <p className="mt-2 text-sm text-on-surface-variant">
          Send a message to {customerName}.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-on-surface">To</span>

            <input
              value={customerEmail}
              readOnly
              className="mt-2 w-full cursor-not-allowed rounded-xl border border-outline/20 bg-surface-container px-3.5 py-3 text-sm text-on-surface-variant outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-on-surface">
              Subject
            </span>

            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Write a subject"
              className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-low px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-on-surface">
              Message
            </span>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder="Write your message"
              className="mt-2 w-full resize-none rounded-xl border border-outline/25 bg-surface-container-low px-3.5 py-3 text-sm leading-relaxed text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-outline/25 bg-surface text-sm font-semibold text-on-surface transition hover:bg-surface-container"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex h-11 flex-[1.3] items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            <Send size={16} />
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
}