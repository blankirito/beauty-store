"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { Address } from "@/types/address";

type AddressFormProps = {
  address?: Address;
  onClose: () => void;
  onSave: (address: Omit<Address, "id">) => void;
};

function getInitialForm(address?: Address): Omit<Address, "id"> {
  if (address) {
    const { id: _, ...formValues } = address;
    return formValues;
  }

  return {
    label: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "Malaysia",
    isDefault: false,
  };
}

export default function AddressForm({
  address,
  onClose,
  onSave,
}: AddressFormProps) {
  const [form, setForm] = useState<Omit<Address, "id">>(() =>
    getInitialForm(address),
  );
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);

  function updateField<K extends keyof Omit<Address, "id">>(
    field: K,
    value: Omit<Address, "id">[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-on-surface/35 md:items-stretch md:justify-end">
      <button
        type="button"
        aria-label="Close address form"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-background p-6 md:h-full md:max-w-md md:rounded-none md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl text-primary">
            {address ? "Edit Address" : "Add Address"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close address form"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-low"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <p className="mb-2 text-xs font-semibold text-on-surface-variant">
                Address Label
              </p>

              <button
                type="button"
                onClick={() => setIsLabelMenuOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={isLabelMenuOpen}
                className="flex w-full items-center justify-between rounded-xl border border-outline/30 bg-surface px-4 py-3 text-sm font-medium text-on-surface outline-none transition hover:border-primary/60 focus:ring-2 focus:ring-primary/20"
              >
                {form.label}

                <ChevronDown
                  size={17}
                  className={
                    isLabelMenuOpen
                      ? "text-primary transition-transform rotate-180"
                      : "text-primary transition-transform"
                  }
                />
              </button>

              {isLabelMenuOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-outline/20 bg-surface p-1 shadow-lg"
                >
                  {["Home", "Office", "Other"].map((label) => {
                    const isSelected = form.label === label;

                    return (
                      <button
                        key={label}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          updateField("label", label);
                          setIsLabelMenuOpen(false);
                        }}
                        className={
                          isSelected
                            ? "flex w-full rounded-lg bg-primary-container/35 px-3 py-2.5 text-left text-sm font-semibold text-primary"
                            : "flex w-full rounded-lg px-3 py-2.5 text-left text-sm text-on-surface transition hover:bg-surface-low"
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 pt-6 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) =>
                  updateField("isDefault", event.target.checked)
                }
                className="h-4 w-4 accent-primary"
              />
              Set as default
            </label>
          </div>

          <Field
            label="Full Name"
            value={form.name}
            onChange={(value) => updateField("name", value)}
          />
          <Field
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(value) => updateField("phone", value)}
          />
          <Field
            label="Street Address"
            value={form.address}
            onChange={(value) => updateField("address", value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="City"
              value={form.city}
              onChange={(value) => updateField("city", value)}
            />
            <Field
              label="State"
              value={form.state}
              onChange={(value) => updateField("state", value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Postcode"
              value={form.postcode}
              onChange={(value) => updateField("postcode", value)}
            />
            <Field
              label="Country"
              value={form.country}
              onChange={(value) => updateField("country", value)}
            />
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-4 font-semibold text-white transition hover:opacity-90"
            >
              {address ? "Save Changes" : "Save Address"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-outline py-4 font-semibold text-on-surface transition hover:bg-surface-low"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

function Field({
  label,
  value,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold text-on-surface-variant">
      {label}
      <input
        type={type}
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg bg-surface px-4 py-3 text-sm font-normal text-on-surface outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}