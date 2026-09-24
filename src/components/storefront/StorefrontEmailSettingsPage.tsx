"use client";

import { FormEvent, useState, useTransition } from "react";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { updateStorefrontEmail } from "@/app/store/[slug]/settings/email/actions";

type StorefrontEmailSettingsPageProps = {
  storeName: string;
  storeSlug: string;
  currentEmail: string;
};

export default function StorefrontEmailSettingsPage({
  storeName,
  storeSlug,
  currentEmail,
}: StorefrontEmailSettingsPageProps) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    startTransition(async () => {
      const result = await updateStorefrontEmail({
        storeSlug,
        newEmail,
        currentPassword,
      });

      if (result.status === "requires-sign-in") {
        router.push(`/login?store=${encodeURIComponent(storeSlug)}`);
        return;
      }

      if (result.status === "error") {
        setNotice({
          type: "error",
          message: result.message,
        });
        return;
      }

      setCurrentPassword("");
      setNotice({
        type: "success",
        message:
          "Verification emails have been sent. Confirm the change from both inboxes to update your email.",
      });
    });
  }

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader storeName={storeName} storeSlug={storeSlug} />

      <section className="mx-auto max-w-xl px-5 pt-9">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary">
          YOUR STORE ACCOUNT
        </p>

        <h1 className="mt-2 font-display text-4xl text-primary">
          Change Email
        </h1>

        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Confirm your current password before changing the email you use to
          sign in.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl bg-surface p-6 shadow-sm"
        >
          <div className="rounded-xl bg-surface-low px-4 py-3">
            <p className="text-xs font-semibold tracking-wide text-on-surface-variant">
              CURRENT EMAIL
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-on-surface">
              {currentEmail}
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <AuthInput
              id="new-email"
              name="email"
              label="New Email Address"
              placeholder="your.new.email@example.com"
              icon={Mail}
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <AuthInput
              id="email-current-password"
              name="currentPassword"
              label="Current Password"
              placeholder="Enter your current password"
              icon={Lock}
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="mt-7">
            <AuthButton
              type="submit"
              loading={isPending}
              loadingtext="Sending verification..."
            >
              Send Verification Email
            </AuthButton>
          </div>

          {notice && (
            <p
              role="status"
              className={`mt-5 rounded-xl px-4 py-3 text-center text-sm leading-6 ${
                notice.type === "success"
                  ? "bg-primary-container/25 text-on-primary-container"
                  : "bg-error-container text-error"
              }`}
            >
              {notice.message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}