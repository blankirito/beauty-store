"use client";

import { FormEvent, useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import PasswordRequirement from "@/components/setting/Password/PasswordRequirement";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { updateStorefrontPassword } from "@/app/store/[slug]/settings/password/actions";

type StorefrontPasswordSettingsPageProps = {
  storeName: string;
  storeSlug: string;
};

export default function StorefrontPasswordSettingsPage({
  storeName,
  storeSlug,
}: StorefrontPasswordSettingsPageProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    startTransition(async () => {
      const result = await updateStorefrontPassword({
        storeSlug,
        currentPassword,
        newPassword,
        confirmPassword,
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
      setNewPassword("");
      setConfirmPassword("");
      setNotice({
        type: "success",
        message: "Your password has been updated.",
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
          Password
        </h1>

        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Use a strong password to keep your account secure.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl bg-surface p-6 shadow-sm"
        >
          <div className="space-y-6">
            <AuthInput
              id="current-password"
              name="current-password"
              label="Current Password"
              placeholder="Enter current password"
              icon={Lock}
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            <AuthInput
              id="new-password"
              name="new-password"
              label="New Password"
              placeholder="Enter new password"
              icon={Lock}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
            />

            <AuthInput
              id="confirm-new-password"
              name="confirm-new-password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              icon={Lock}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />

            <PasswordRequirement />
          </div>

          <div className="mt-7">
            <AuthButton
              type="submit"
              loading={isPending}
              loadingtext="Updating password..."
            >
              Update Password
            </AuthButton>
          </div>

          {notice && (
            <p
              role="status"
              className={`mt-5 rounded-xl px-4 py-3 text-center text-sm ${
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