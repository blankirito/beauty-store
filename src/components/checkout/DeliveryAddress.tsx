"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

type Address = {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const initialAddress: Address = {
  name: "Alex Morgan",
  street: "18 Jalan Damai",
  city: "Kuala Lumpur",
  state: "Wilayah Persekutuan",
  postalCode: "55000",
  country: "Malaysia",
};

export default function DeliveryAddress() {
  const [address, setAddress] = useState<Address>(initialAddress);
  const [draftAddress, setDraftAddress] =
    useState<Address>(initialAddress);
  const [isEditing, setIsEditing] = useState(false);

  function updateDraft(field: keyof Address, value: string) {
    setDraftAddress((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddress(draftAddress);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraftAddress(address);
    setIsEditing(false);
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0px_4px_12px_rgba(132,81,69,0.05)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-on-surface">
          Delivery Address
        </h2>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-primary transition hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="delivery-name"
              className="text-xs font-semibold text-on-surface-variant"
            >
              Recipient Name
            </label>

            <input
              id="delivery-name"
              value={draftAddress.name}
              onChange={(event) => updateDraft("name", event.target.value)}
              className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="delivery-street"
              className="text-xs font-semibold text-on-surface-variant"
            >
              Street Address
            </label>

            <input
              id="delivery-street"
              autoComplete="street-address"
              value={draftAddress.street}
              onChange={(event) =>
                updateDraft("street", event.target.value)
              }
              className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="delivery-city"
                className="text-xs font-semibold text-on-surface-variant"
              >
                City
              </label>

              <input
                id="delivery-city"
                autoComplete="address-level2"
                value={draftAddress.city}
                onChange={(event) => updateDraft("city", event.target.value)}
                className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="delivery-state"
                className="text-xs font-semibold text-on-surface-variant"
              >
                State
              </label>

              <input
                id="delivery-state"
                autoComplete="address-level1"
                value={draftAddress.state}
                onChange={(event) =>
                  updateDraft("state", event.target.value)
                }
                className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="delivery-postal-code"
                className="text-xs font-semibold text-on-surface-variant"
              >
                Postal Code
              </label>

              <input
                id="delivery-postal-code"
                autoComplete="postal-code"
                value={draftAddress.postalCode}
                onChange={(event) =>
                  updateDraft("postalCode", event.target.value)
                }
                className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="delivery-country"
                className="text-xs font-semibold text-on-surface-variant"
              >
                Country
              </label>

              <input
                id="delivery-country"
                autoComplete="country-name"
                value={draftAddress.country}
                onChange={(event) =>
                  updateDraft("country", event.target.value)
                }
                className="rounded-lg bg-surface-container px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
            >
              Save Address
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center rounded-lg bg-primary-container/20 p-3">
            <MapPin size={22} className="text-primary" />
          </div>

          <div className="text-sm text-on-surface-variant">
            <p className="font-semibold text-on-surface">{address.name}</p>
            <p className="mt-1">{address.street}</p>
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
          </div>
        </div>
      )}
    </section>
  );
}