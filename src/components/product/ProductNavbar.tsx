"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ProductNavbar() {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Boutique",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);
      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 1800);
    } catch {
      // User closed the sharing panel, or the browser blocked clipboard access.
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-surface/80 px-5 backdrop-blur-md">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
      >
        <ArrowLeft size={22} />
      </button>

      <h1 className="font-display text-xl text-primary">Boutique</h1>

      <button
        type="button"
        onClick={handleShare}
        aria-label={isCopied ? "Link copied" : "Share product"}
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
      >
        {isCopied ? <Check size={21} /> : <Share2 size={22} />}
      </button>
    </header>
  );
}