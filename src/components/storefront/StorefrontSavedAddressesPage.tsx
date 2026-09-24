"use client";

import { FormEvent, useState, useTransition } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import {
  deleteStorefrontAddress,
  saveStorefrontAddress,
  setDefaultStorefrontAddress,
} from "@/app/store/[slug]/saved-addresses/actions";
import type { StorefrontSavedAddress } from "@/lib/storefront/storefrontAddresses";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

type StorefrontSavedAddressesPageProps = {
  storeName: string;
  storeSlug: string;
  addresses: StorefrontSavedAddress[];
};

type AddressForm = {
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const emptyAddressForm: AddressForm = {
  label: "",
  recipientName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Malaysia",
  isDefault: false,
};

function addressToForm(address: StorefrontSavedAddress): AddressForm {
  return {
    label: address.label,
    recipientName: address.recipientName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

export default function StorefrontSavedAddressesPage({
  storeName,
  storeSlug,
  addresses,
}: StorefrontSavedAddressesPageProps) {
  const router = useRouter();
  const [editingAddress, setEditingAddress] =
    useState<StorefrontSavedAddress | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<AddressForm>(emptyAddressForm);
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const isEditing = editingAddress !== null;
  const isShowingForm = isCreating || isEditing;
  const reachedAddressLimit = addresses.length >= 5;
  const [addressToDelete, setAddressToDelete] =
    useState<StorefrontSavedAddress | null>(null);

  function openCreateForm() {
    setNotice("");
    setEditingAddress(null);
    setForm(emptyAddressForm);
    setIsCreating(true);
  }

  function openEditForm(address: StorefrontSavedAddress) {
    setNotice("");
    setEditingAddress(address);
    setForm(addressToForm(address));
    setIsCreating(false);
  }

  function closeForm() {
    setNotice("");
    setEditingAddress(null);
    setForm(emptyAddressForm);
    setIsCreating(false);
  }

  function updateFormField(
    field: keyof AddressForm,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    startTransition(async () => {
      const result = await saveStorefrontAddress({
        storeSlug,
        addressId: editingAddress?.id,
        ...form,
      });

      if (result.status === "requires-sign-in") {
        router.push(`/login?store=${encodeURIComponent(storeSlug)}`);
        return;
      }

      if (result.status === "error") {
        setNotice(result.message);
        return;
      }

      closeForm();
      router.refresh();
    });
  }

  function handleSetDefault(addressId: string) {
    setNotice("");

    startTransition(async () => {
      const result = await setDefaultStorefrontAddress(storeSlug, addressId);

      if (result.status === "requires-sign-in") {
        router.push(`/login?store=${encodeURIComponent(storeSlug)}`);
        return;
      }

      if (result.status === "error") {
        setNotice(result.message);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete(addressId: string) {
    setNotice("");

    startTransition(async () => {
      const result = await deleteStorefrontAddress(storeSlug, addressId);

      if (result.status === "requires-sign-in") {
        router.push(`/login?store=${encodeURIComponent(storeSlug)}`);
        return;
      }

      if (result.status === "error") {
        setNotice(result.message);
        return;
      }

      setAddressToDelete(null);
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen pb-24">
      <StorefrontHeader storeName={storeName} storeSlug={storeSlug} />

      <section className="px-5 pt-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary">
              YOUR STORE ACCOUNT
            </p>

            <h1 className="mt-2 font-display text-4xl text-primary">
              Saved Addresses
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
              Save up to five delivery addresses for faster checkout.
            </p>
          </div>

          {!isShowingForm && (
            <button
              type="button"
              onClick={openCreateForm}
              disabled={reachedAddressLimit || isPending}
              className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-outline"
            >
              <Plus size={17} />
              Add
            </button>
          )}
        </div>

        {notice && (
          <p role="alert" className="mt-5 rounded-xl bg-error-container p-4 text-sm text-error">
            {notice}
          </p>
        )}

        {isShowingForm ? (
          <form
            onSubmit={handleSave}
            className="mt-8 rounded-2xl bg-surface p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl text-primary">
                {isEditing ? "Edit address" : "New address"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                disabled={isPending}
                className="text-sm font-semibold text-primary"
              >
                Cancel
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={form.label}
                onChange={(event) =>
                  updateFormField("label", event.target.value)
                }
                placeholder="Label, e.g. Home or Work"
                className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
              />

              <input
                value={form.recipientName}
                onChange={(event) =>
                  updateFormField("recipientName", event.target.value)
                }
                placeholder="Recipient name"
                className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
              />

              <input
                value={form.phone}
                onChange={(event) =>
                  updateFormField("phone", event.target.value)
                }
                type="tel"
                placeholder="Phone number"
                className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
              />

              <input
                value={form.addressLine1}
                onChange={(event) =>
                  updateFormField("addressLine1", event.target.value)
                }
                placeholder="Address line 1"
                className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
              />

              <input
                value={form.addressLine2}
                onChange={(event) =>
                  updateFormField("addressLine2", event.target.value)
                }
                placeholder="Address line 2 (optional)"
                className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.city}
                  onChange={(event) =>
                    updateFormField("city", event.target.value)
                  }
                  placeholder="City"
                  className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
                />

                <input
                  value={form.state}
                  onChange={(event) =>
                    updateFormField("state", event.target.value)
                  }
                  placeholder="State"
                  className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.postalCode}
                  onChange={(event) =>
                    updateFormField("postalCode", event.target.value)
                  }
                  placeholder="Postal code"
                  className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
                />

                <input
                  value={form.country}
                  onChange={(event) =>
                    updateFormField("country", event.target.value)
                  }
                  placeholder="Country"
                  className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-surface-low p-4 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={form.isDefault}
                disabled={editingAddress?.isDefault || isPending}
                onChange={(event) =>
                  updateFormField("isDefault", event.target.checked)
                }
                className="h-4 w-4 accent-primary"
              />

              <span>
                {editingAddress?.isDefault
                  ? "This is your default address"
                  : "Make this my default address"}
              </span>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-outline"
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Save address"}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-2xl bg-surface p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-primary">
                          {address.label}
                        </h2>

                        {address.isDefault && (
                          <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-xs font-semibold text-primary">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-on-surface-variant">
                        {address.recipientName} · {address.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditForm(address)}
                    disabled={isPending}
                    aria-label={`Edit ${address.label} address`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
                  >
                    <Pencil size={18} />
                  </button>
                </div>

                <address className="mt-4 not-italic text-sm leading-6 text-on-surface-variant">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </address>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-outline/20 pt-4">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:text-outline"
                    >
                      <Star size={16} />
                      Set as default
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setAddressToDelete(address)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-error disabled:cursor-not-allowed disabled:text-outline"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {addresses.length === 0 && (
              <div className="rounded-2xl bg-surface-low p-8 text-center">
                <h2 className="font-display text-2xl text-primary">
                  No saved addresses yet
                </h2>

                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  Add an address once, then use it for faster checkout.
                </p>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
                >
                  <Plus size={17} />
                  Add new address
                </button>
              </div>
            )}

            {reachedAddressLimit && (
              <p className="text-sm text-on-surface-variant">
                You have reached the limit of five saved addresses.
              </p>
            )}
          </div>
        )}
      </section>

      <ConfirmationDialog
        isOpen={addressToDelete !== null}
        title="Delete saved address?"
        description={
          addressToDelete
            ? `Delete your "${addressToDelete.label}" address? You can add it again later if needed.`
            : ""
        }
        confirmLabel={isPending ? "Deleting..." : "Delete"}
        onCancel={() => setAddressToDelete(null)}
        onConfirm={() => {
          if (addressToDelete) {
            handleDelete(addressToDelete.id);
          }
        }}
      />
    </main>
  );
}