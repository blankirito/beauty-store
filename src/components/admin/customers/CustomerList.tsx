"use client";

import {
  MapPin,
  MoreHorizontal,
  Pencil,
  ShoppingBag,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import type { AdminCustomer } from "@/data/adminCustomers";

type CustomerListProps = {
  items: AdminCustomer[];
};

function getStatusClass(status: AdminCustomer["status"]) {
  if (status === "VIP") {
    return "bg-primary-container/50 text-on-primary-container";
  }

  if (status === "Active") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (status === "New") {
    return "bg-surface-container text-primary";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function CustomerList({ items }: CustomerListProps) {
  const router = useRouter();
  const [openMenuCustomerId, setOpenMenuCustomerId] = useState<string | null>(
    null,
  );
  const [customerToToggle, setCustomerToToggle] =
    useState<AdminCustomer | null>(null);

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-8 text-center shadow-sm">
        <p className="font-display text-xl text-on-surface">
          No customers found
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Try another name, email, customer ID, or status.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {items.slice(0, 5).map((customer) => {
        const isInactive = customer.status === "Inactive";
        const isMenuOpen = openMenuCustomerId === customer.id;

        function openCustomerDetail() {
          router.push(`/admin/customers/${customer.id}`);
        }

        return (
          <article
            key={customer.id}
            role="link"
            tabIndex={0}
            onClick={openCustomerDetail}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCustomerDetail();
              }
            }}
            className="relative cursor-pointer rounded-2xl border border-outline/15 bg-surface-container-lowest p-4 shadow-sm transition hover:border-primary/35 hover:bg-surface-container-low"
          >
            <div className="mb-3 flex items-center justify-between border-b border-outline/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">
                  #{customer.id}
                </span>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(customer.status)}`}
                >
                  {customer.status === "VIP"
                    ? "VIP Member"
                    : customer.status === "New"
                      ? "New Customer"
                      : customer.status}
                </span>
              </div>

              <span className="text-[10px] text-on-surface-variant">
                Member since {customer.memberSince}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-sm font-bold text-primary">
                {customer.initials}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-on-surface">
                  {customer.name}
                </h2>

                <p className="truncate text-xs text-on-surface-variant">
                  {customer.email}
                </p>

                <p className="mt-1 flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <MapPin size={13} />
                  <span className="truncate">{customer.location}</span>
                </p>
              </div>
            </div>

            <div className="my-3 grid grid-cols-3 gap-2 rounded-xl border border-outline/10 bg-surface p-2.5 text-center">
              <div>
                <p className="text-[10px] text-on-surface-variant">Orders</p>
                <p className="text-xs font-bold text-on-surface">
                  {customer.orderCount} orders
                </p>
              </div>

              <div className="border-x border-outline/15">
                <p className="text-[10px] text-on-surface-variant">
                  Total Spent
                </p>
                <p className="font-display text-xs font-bold text-primary">
                  RM{customer.totalSpent.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-on-surface-variant">
                  Last Order
                </p>
                <p className="text-xs font-semibold text-on-surface">
                  {customer.lastOrder}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openCustomerDetail();
                }}
                className="flex-1 rounded-xl bg-primary py-2 text-xs font-medium text-on-primary shadow-sm"
              >
                View Details
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();

                  setOpenMenuCustomerId((currentId) =>
                    currentId === customer.id ? null : customer.id,
                  );
                }}
                aria-label={`More actions for ${customer.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-outline/30 text-on-surface-variant"
              >
                <MoreHorizontal size={17} />
              </button>
            </div>

            {isMenuOpen && (
              <div
                onClick={(event) => event.stopPropagation()}
                className="absolute bottom-14 right-4 z-20 w-48 rounded-xl border border-outline/20 bg-surface-container-lowest p-1.5 shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/admin/customers/${customer.id}/edit`);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-on-surface transition hover:bg-surface-container"
                >
                  <Pencil size={15} />
                  Edit Customer
                </button>

                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-on-surface-variant opacity-55"
                >
                  <ShoppingBag size={15} />
                  Create Order
                  <span className="ml-auto text-[9px]">Soon</span>
                </button>

                <div className="my-1 border-t border-outline/15" />

                <button
                  type="button"
                  onClick={() => {
                    setCustomerToToggle(customer);
                    setOpenMenuCustomerId(null);
                  }}
                  className={
                    isInactive
                      ? "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-primary transition hover:bg-surface-container"
                      : "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-error transition hover:bg-error-container"
                  }
                >
                  {isInactive ? (
                    <UserRoundCheck size={15} />
                  ) : (
                    <UserRoundX size={15} />
                  )}
                  {isInactive ? "Activate Customer" : "Deactivate Customer"}
                </button>
              </div>
            )}
          </article>
        );
      })}

      <ConfirmationDialog
        isOpen={customerToToggle !== null}
        title={
          customerToToggle?.status === "Inactive"
            ? "Activate customer?"
            : "Deactivate customer?"
        }
        description={
          customerToToggle?.status === "Inactive"
            ? `${customerToToggle.name} will regain account access and be able to place orders.`
            : `${customerToToggle?.name} will no longer be able to access their account. Historical orders will remain available.`
        }
        confirmLabel={
          customerToToggle?.status === "Inactive" ? "Activate" : "Deactivate"
        }
        onCancel={() => setCustomerToToggle(null)}
        onConfirm={() => {
          // UI stage only — backend will persist the account status.
          setCustomerToToggle(null);
        }}
      />
    </section>
  );
}