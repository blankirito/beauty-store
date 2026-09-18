"use client";

import { useState } from "react";

export default function SocialLogin() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setMessage(
            "Google sign-in will be available when authentication is connected.",
          )
        }
        className="h-12 w-full rounded-lg border border-outline text-on-surface-variant transition hover:bg-surface-low"
      >
        Continue with Google
      </button>

      {message && (
        <p
          role="status"
          className="mt-3 rounded-lg bg-primary-container/25 px-3 py-2 text-center text-xs leading-relaxed text-on-primary-container"
        >
          {message}
        </p>
      )}
    </div>
  );
}