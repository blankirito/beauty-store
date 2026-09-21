"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSignOutDestination } from "@/lib/auth/getSignOutDestination";
import { createClient } from "@/lib/supabase/client";

type AdminLogoutButtonProps = {
  onLoggedOut?: () => void;
};

export default function AdminLogoutButton({
  onLoggedOut,
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setIsLoading(true);
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsLoading(false);
      setErrorMessage("Could not log out. Please try again.");
      return;
    }

    onLoggedOut?.();
    router.replace(getSignOutDestination());
    router.refresh();
  }

  return (
    <div className="mt-auto border-t border-outline/15 pt-4">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={20} />
        {isLoading ? "Logging out..." : "Log out"}
      </button>

      {errorMessage && (
        <p className="mt-2 px-3 text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}