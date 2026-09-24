"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  toStorefrontProduct,
  type DatabaseStorefrontProduct,
  type StorefrontProduct,
} from "@/lib/storefront/storefrontProduct";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import {
  prepareGuestCheckoutRequest,
} from "@/lib/storefront/guestCheckout";
import type { StorefrontPaymentMethod } from "@/lib/storefront/getPublicStorefront";
import { toStorefrontCartView } from "@/lib/storefront/storefrontCartView";
import { useStorefrontCart } from "./StorefrontCartProvider";
import type { StorefrontSavedAddress } from "@/lib/storefront/storefrontAddresses";

type StorefrontCheckoutPageProps = {
  storeId: string;
  storeName: string;
  storeSlug: string;
  customerEmail: string;
  paymentMethods: StorefrontPaymentMethod[];
  preferredPaymentMethodId: string | null;
  savedAddresses: StorefrontSavedAddress[];
  defaultAddressId: string | null;
};

type CheckoutSuccess = {
  order_id: string;
  order_number: string;
  tracking_token: string;
  payment_method_label: string;
  payment_instructions: string;
};

export default function StorefrontCheckoutPage({
  storeId,
  storeName,
  storeSlug,
  customerEmail,
  paymentMethods,
  preferredPaymentMethodId,
  savedAddresses,
  defaultAddressId,
}: StorefrontCheckoutPageProps) {
  const { items, isReady, updateQuantity } = useStorefrontCart();

  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<CheckoutSuccess | null>(null);
  const initialPaymentMethodId =
    preferredPaymentMethodId &&
      paymentMethods.some(
        (paymentMethod) =>
          paymentMethod.id === preferredPaymentMethodId,
      )
      ? preferredPaymentMethodId
      : paymentMethods[0]?.id ?? "";

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    initialPaymentMethodId,
  );
  const initialAddress =
    savedAddresses.find((address) => address.id === defaultAddressId) ?? null;

  const [selectedAddressId, setSelectedAddressId] = useState(
    initialAddress?.id ?? "",
  );

  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);

  const selectedAddress =
    savedAddresses.find((address) => address.id === selectedAddressId) ?? null;

  const [form, setForm] = useState({
    customerName: initialAddress?.recipientName ?? "",
    customerEmail,
    customerPhone: initialAddress?.phone ?? "",
    addressLine1: initialAddress?.addressLine1 ?? "",
    addressLine2: initialAddress?.addressLine2 ?? "",
    city: initialAddress?.city ?? "",
    state: initialAddress?.state ?? "",
    postalCode: initialAddress?.postalCode ?? "",
    country: initialAddress?.country ?? "Malaysia",
  });

  const cartItems = useMemo(
    () => items.filter((item) => item.storeSlug === storeSlug),
    [items, storeSlug],
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (cartItems.length === 0) {
      setProducts([]);
      setIsLoadingProducts(false);
      return;
    }

    let isCurrent = true;

    async function loadProducts() {
      setIsLoadingProducts(true);

      const { data } = await createClient()
        .from("products")
        .select(`
          id,
          store_id,
          slug,
          name,
          description,
          category,
          price,
          stock,
          rating,
          review_count,
          is_new,
          product_images (
            storage_path,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .eq("store_id", storeId)
        .eq("is_active", true)
        .in(
          "id",
          cartItems.map((item) => item.productId),
        );

      if (isCurrent) {
        setProducts(
          (data ?? []).map((product) =>
            toStorefrontProduct(product as DatabaseStorefrontProduct),
          ),
        );
        setIsLoadingProducts(false);
      }
    }

    void loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [cartItems, isReady, storeId]);

  const viewItems = toStorefrontCartView(cartItems, products);

  const subtotal = viewItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  function updateFormField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function applySavedAddress(address: StorefrontSavedAddress) {
    setSelectedAddressId(address.id);

    setForm((current) => ({
      ...current,
      customerName: address.recipientName,
      customerPhone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    }));

    setIsAddressPickerOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setErrorMessage(null);
      setIsSubmitting(true);

      const request = prepareGuestCheckoutRequest({
        storeSlug,
        ...form,
        paymentMethodId: selectedPaymentMethodId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const { data, error } = await createClient().rpc(
        "create_guest_checkout_order",
        {
          p_store_slug: request.storeSlug,
          p_customer_name: request.customerName,
          p_customer_email: request.customerEmail,
          p_customer_phone: request.customerPhone,
          p_address_line_1: request.addressLine1,
          p_address_line_2: request.addressLine2,
          p_city: request.city,
          p_state: request.state,
          p_postal_code: request.postalCode,
          p_country: request.country,
          p_payment_method_id: request.paymentMethodId,
          p_items: request.items,
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      const order = (
        data as unknown as CheckoutSuccess[] | null
      )?.[0];

      if (!order) {
        throw new Error("Could not create your order.");
      }

      cartItems.forEach((item) => {
        updateQuantity(storeSlug, item.productId, 0);
      });

      setSuccess(order);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not place your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady || isLoadingProducts) {
    return (
      <main className="min-h-screen bg-background px-5 py-6">
        <div className="h-8 w-44 animate-pulse rounded bg-surface-low" />
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background px-5 py-12">
        <section className="mx-auto max-w-lg rounded-2xl bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
            <CheckCircle2 size={30} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            {storeName}
          </p>

          <h1 className="mt-2 font-display text-3xl text-primary">
            Order placed
          </h1>

          <p className="mt-3 text-on-surface-variant">
            Thank you. Your order reference is:
          </p>

          <p className="mt-2 font-display text-2xl text-primary">
            {success.order_number}
          </p>

          <div className="mt-6 rounded-xl bg-surface-low p-5 text-left">
            <p className="font-semibold text-primary">
              {success.payment_method_label}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {success.payment_instructions ||
                "The store will contact you with payment instructions."}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={`/store/${storeSlug}/orders/${success.order_number}?token=${encodeURIComponent(success.tracking_token)}`}
              className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-[#915747] px-5 py-3 font-semibold text-[#915747]"
            >
              Track this order
            </a>

            <Link
              href={`/store/${storeSlug}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Back to store
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (viewItems.length === 0) {
    return (
      <main className="min-h-screen bg-background px-5 py-12 text-center">
        <h1 className="font-display text-3xl text-primary">
          Your cart is empty
        </h1>

        <Link
          href={`/store/${storeSlug}`}
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <header className="flex h-16 items-center border-b border-outline bg-surface px-5">
        <Link
          href={`/store/${storeSlug}/cart`}
          aria-label="Back to cart"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary"
        >
          <ArrowLeft size={22} />
        </Link>

        <h1 className="mx-auto font-display text-xl text-primary">
          Checkout
        </h1>

        <div className="h-10 w-10" />
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-6 px-5 py-6"
      >
        <section className="rounded-2xl bg-surface p-6 shadow-sm">
          <h2 className="font-display text-xl text-primary">
            Contact information
          </h2>

          <div className="mt-4 grid gap-3">
            <input
              value={form.customerName}
              onChange={(event) =>
                updateFormField("customerName", event.target.value)
              }
              placeholder="Full name"
              className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
            />

            <input
              value={form.customerEmail}
              onChange={(event) =>
                updateFormField("customerEmail", event.target.value)
              }
              type="email"
              placeholder="Email address"
              className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
            />

            <input
              value={form.customerPhone}
              onChange={(event) =>
                updateFormField("customerPhone", event.target.value)
              }
              type="tel"
              placeholder="Phone number"
              className="rounded-xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
        </section>

        <section className="rounded-2xl bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl text-primary">
              Delivery address
            </h2>

            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddressPickerOpen((current) => !current)}
                className="text-sm font-semibold text-primary"
              >
                {isAddressPickerOpen ? "Done" : "Change"}
              </button>
            )}
          </div>

          {selectedAddress && (
            <div className="mt-4 rounded-xl bg-primary-fixed/50 p-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />

                <div className="text-sm leading-6 text-on-surface-variant">
                  <p className="font-semibold text-primary">
                    {selectedAddress.label}
                    {selectedAddress.isDefault ? " · Default" : ""}
                  </p>
                  <p>
                    {selectedAddress.recipientName} · {selectedAddress.phone}
                  </p>
                  <p>{selectedAddress.addressLine1}</p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isAddressPickerOpen && (
            <div className="mt-4 space-y-2">
              {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => applySavedAddress(address)}
                  className={`w-full rounded-xl border p-4 text-left transition ${selectedAddressId === address.id
                      ? "border-primary bg-primary/5"
                      : "border-outline/30 bg-surface-low hover:border-primary/50"
                    }`}
                >
                  <p className="font-semibold text-primary">
                    {address.label}
                    {address.isDefault ? " · Default" : ""}
                  </p>

                  <p className="mt-1 text-sm text-on-surface-variant">
                    {address.recipientName} · {address.phone}
                  </p>

                  <p className="mt-1 text-sm text-on-surface-variant">
                    {address.addressLine1}, {address.city}
                  </p>
                </button>
              ))}

              <p className="px-1 text-xs leading-5 text-on-surface-variant">
                You can still edit the fields below for this order only.
              </p>
            </div>
          )}

          <div className="mt-4 grid gap-3">
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
        </section>

        <section className="rounded-2xl bg-surface p-6 shadow-sm">
          <h2 className="font-display text-xl text-primary">
            Payment method
          </h2>

          <div className="mt-4 space-y-3">
            {paymentMethods.map((paymentMethod) => (
              <label
                key={paymentMethod.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline/70 bg-background p-4 transition has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={paymentMethod.id}
                  checked={selectedPaymentMethodId === paymentMethod.id}
                  onChange={() =>
                    setSelectedPaymentMethodId(paymentMethod.id)
                  }
                  className="mt-1 accent-primary"
                />

                <span>
                  <span className="block font-semibold text-primary">
                    {paymentMethod.label}
                  </span>

                  {paymentMethod.instructions && (
                    <span className="mt-1 block text-sm text-on-surface-variant">
                      {paymentMethod.instructions}
                    </span>
                  )}
                </span>
              </label>
            ))}

            {paymentMethods.length === 0 && (
              <p className="rounded-xl bg-error-container p-4 text-sm text-error">
                This store has no payment method available yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-surface-low p-6">
          <h2 className="font-display text-xl text-primary">
            Order summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            {viewItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 border-b border-outline/30 pb-3 text-on-surface-variant last:border-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {product.imagePath && process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getPublicProductImageUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, product.imagePath)}
                        alt={product.imageAlt ?? product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="truncate">
                    {product.name} × {quantity}
                  </span>
                </div>

                <span className="shrink-0">RM{(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="flex justify-between border-t border-outline pt-4 font-semibold text-primary">
              <span>Total</span>
              <span>RM{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {errorMessage && (
          <p className="rounded-xl bg-error-container p-4 text-sm text-error">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || paymentMethods.length === 0}
          className="w-full rounded-full bg-primary py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-outline"
        >
          {isSubmitting
            ? "Placing order..."
            : `Place Order · RM${subtotal.toFixed(2)}`}
        </button>
      </form>
    </main>
  );
}
