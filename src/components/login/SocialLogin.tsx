"use client";

import { getSafeAuthCallbackStoreSlug } from "@/lib/auth/authCallback";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

type SocialLoginProps = {
    storeSlug?: string;
};

export default function SocialLogin({
    storeSlug,
}: SocialLoginProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleGoogleSignIn() {
        setLoading(true);
        setMessage("");

        const callbackUrl = new URL(
            "/auth/callback",
            window.location.origin,
        );
        const normalizedStoreSlug = getSafeAuthCallbackStoreSlug(
            storeSlug ?? null,
        );

        if (normalizedStoreSlug) {
            callbackUrl.searchParams.set("store", normalizedStoreSlug);
        }

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: callbackUrl.toString(),
            },
        });

        if (error) {
            setLoading(false);
            setMessage(
                "Google sign-in could not start. Please try again.",
            );
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="h-12 w-full rounded-lg border border-outline text-on-surface-variant transition hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Opening Google..." : "Continue with Google"}
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