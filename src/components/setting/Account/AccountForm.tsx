"use client";

import { Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";

export default function AccountForm() {
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("+60 12-345 6789");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    window.setTimeout(() => {
      setLoading(false);
      setMessage(
        "Profile changes will be saved when account backend is connected.",
      );
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthInput
        id="account-name"
        name="name"
        label="Full Name"
        placeholder="Your Full Name"
        icon={User}
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
        required
      />

      <AuthInput
        id="account-email"
        name="email"
        label="Email Address"
        placeholder="your.email@example.com"
        icon={Mail}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <AuthInput
        id="account-phone"
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

      <div className="pt-2">
        <AuthButton
          type="submit"
          loading={loading}
          loadingtext="Saving Changes..."
        >
          Save Changes
        </AuthButton>
      </div>

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