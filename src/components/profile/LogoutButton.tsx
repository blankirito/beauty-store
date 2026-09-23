"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSignOutDestination } from "@/lib/auth/getSignOutDestination";
import { createClient } from "@/lib/supabase/client";

export default function LogOut() {
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

    router.replace(getSignOutDestination());
    router.refresh();
  }

  return (
    <div className="mt-8 w-full px-5">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-semibold text-red-500 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogOutIcon size={20} />
        {isLoading ? "Logging out..." : "Logout"}
      </button>

      {errorMessage && (
        <p role="status" className="mt-3 text-center text-sm text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}