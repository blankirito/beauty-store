"use client";

import {
  Lock,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import AuthButton from "../auth/AuthButton";
import AuthInput from "../auth/AuthInput";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Your passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setMessage(
        "Account registration will be connected when authentication is added during the backend phase.",
      );
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <AuthInput
        id="register-name"
        name="name"
        label="Full Name"
        placeholder="Alex Morgan"
        icon={User}
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        autoComplete="name"
        required
      />

      <AuthInput
        id="register-email"
        name="email"
        label="Email Address"
        placeholder="alex@example.com"
        icon={Mail}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <AuthInput
        id="register-phone"
        name="phone"
        label="Phone Number"
        placeholder="+60 12-345 6789"
        icon={Phone}
        type="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        autoComplete="tel"
        required
      />

      <AuthInput
        id="register-password"
        name="password"
        label="Password"
        placeholder="••••••••"
        icon={Lock}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <AuthInput
        id="register-confirm-password"
        name="confirm-password"
        label="Confirm Password"
        placeholder="••••••••"
        icon={LockKeyhole}
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-on-surface-variant">
        <input
          type="checkbox"
          checked={hasAcceptedTerms}
          onChange={(event) => setHasAcceptedTerms(event.target.checked)}
          required
          className="mt-1 h-4 w-4 flex-shrink-0 accent-primary"
        />

        <span>
          I agree to the Terms of Service and Privacy Policy.
        </span>
      </label>

      <AuthButton
        type="submit"
        loading={loading}
        loadingtext="Creating Account..."
      >
        Register
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