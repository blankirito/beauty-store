"use client";

import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import AuthButton from "../auth/AuthButton";
import AuthInput from "../auth/AuthInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice("");

    window.setTimeout(() => {
      setLoading(false);
      setNotice(
        "Sign in will be connected when authentication is added during the backend phase.",
      );
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AuthInput
        id="login-email"
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

      <div>
        <AuthInput
          id="login-password"
          name="password"
          label="Password"
          placeholder="••••••••"
          icon={Lock}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() =>
              setNotice(
                "Password reset will be available after authentication is connected.",
              )
            }
            className="text-sm font-semibold text-primary transition hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <AuthButton
        type="submit"
        loading={loading}
        loadingtext="Logging In..."
      >
        Login
      </AuthButton>

      {notice && (
        <p
          role="status"
          className="rounded-lg bg-primary-container/25 px-3 py-2 text-center text-xs leading-relaxed text-on-primary-container"
        >
          {notice}
        </p>
      )}
    </form>
  );
}