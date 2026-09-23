"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type StorefrontNavbarProps = {
  storeName: string;
  homeHref: string;
};

export default function StorefrontNavbar({
  storeName,
  homeHref,
}: StorefrontNavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center bg-surface/80 px-5 backdrop-blur-md">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
      >
        <ArrowLeft size={22} />
      </button>

      <a
        href={homeHref}
        className="absolute left-1/2 -translate-x-1/2 font-display text-xl text-primary"
      >
        {storeName}
      </a>
    </header>
  );
}
