"use client";

import { Globe2, LoaderCircle, Save, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  updateStoreProfile,
  type UpdateStoreProfileInput,
} from "@/app/admin/settings/profile/actions";

type StoreProfileEditorProps = {
  initialProfile: {
    name: string;
    slug: string;
    description: string | null;
  };
};

export default function StoreProfileEditor({
  initialProfile,
}: StoreProfileEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(initialProfile.name);
  const [slug, setSlug] = useState(initialProfile.slug);
  const [description, setDescription] = useState(
    initialProfile.description ?? "",
  );
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const publicPath = `/store/${slug.trim().toLowerCase()}`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSavedSlug(null);

    const input: UpdateStoreProfileInput = {
      name,
      slug,
      description,
    };

    startTransition(async () => {
      const result = await updateStoreProfile(input);

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      setName(result.data.name);
      setSlug(result.data.slug);
      setDescription(result.data.description ?? "");
      setSavedSlug(result.data.slug);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
    >
      <label className="block">
        <span className="text-sm font-semibold text-on-surface">
          Store name
        </span>

        <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
          This appears throughout your storefront and checkout.
        </span>

        <span className="relative mt-3 block">
          <Store
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={120}
            required
            className="h-11 w-full rounded-xl border border-outline/20 bg-surface pl-10 pr-3 text-sm text-on-surface outline-none transition focus:border-primary"
          />
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-on-surface">
          Store URL
        </span>

        <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
          Use lowercase letters, numbers, and hyphens only.
        </span>

        <span className="relative mt-3 block">
          <Globe2
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />

          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            maxLength={80}
            required
            className="h-11 w-full rounded-xl border border-outline/20 bg-surface pl-10 pr-3 text-sm text-on-surface outline-none transition focus:border-primary"
          />
        </span>

        <span className="mt-2 block break-all text-xs text-primary">
          Public link: {publicPath}
        </span>
      </label>

      <section className="rounded-xl border border-warning/25 bg-warning-container/20 p-3">
        <p className="text-sm font-semibold text-on-surface">
          Changing your store URL
        </p>

        <p className="mt-1 text-xs leading-5 text-on-surface-variant">
          Old shared links will stop working after you save a new URL.
        </p>
      </section>

      <label className="block">
        <span className="text-sm font-semibold text-on-surface">
          Store description
        </span>

        <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
          Optional. Introduce your store to customers.
        </span>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
          rows={5}
          placeholder="Tell customers about your store."
          className="mt-3 w-full resize-none rounded-xl border border-outline/20 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-error-container/40 px-3 py-3 text-sm font-medium text-error"
        >
          {error}
        </p>
      )}

      {savedSlug && (
        <p
          role="status"
          className="rounded-xl bg-primary-container/25 px-3 py-3 text-sm font-medium text-on-primary-container"
        >
          Store profile saved. Your public link is /store/{savedSlug}.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <Save size={17} />
        )}

        {isPending ? "Saving..." : "Save store profile"}
      </button>
    </form>
  );
}