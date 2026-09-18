"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import PasswordRequirement from "./PasswordRequirement";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const hasMinimumLength = newPassword.length >= 8;
    const hasNumber = /\d/.test(newPassword);
    const hasSymbol = /[!@#$%^&*]/.test(newPassword);

    if (!hasMinimumLength || !hasNumber || !hasSymbol) {
      setMessage("Your new password does not meet all requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Your new passwords do not match.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setMessage(
        "Password updates will be connected when account backend is added.",
      );
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <AuthButton
        type="submit"
        loading={loading}
        loadingtext="Updating Password..."
      >
        Update Password
      </AuthButton>

      {message && (
        <p
          role="status"
          className="rounded-lg bg-primary-container/25 px-3 py-2 text-center text-xs leading-relaxed text-on-primary-container"
        >
          {message}
        </p>
      )}
    </form>
  );
}