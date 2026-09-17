import { MapPin, MoreHorizontal } from "lucide-react";
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

function getMainAction(status: AdminCustomer["status"]) {
  if (status === "VIP") return "Create Order";
  if (status === "Inactive") return "Re-engage";
  return "Send Email";
}

export default function CustomerList({ items }: CustomerListProps) {
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
      {items.slice(0, 5).map((customer) => (
        <article
          key={customer.id}
          className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between border-b border-outline/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">
                #{customer.id}
              </span>

              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(customer.status)}`}>
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
              className="flex-1 rounded-xl bg-primary py-2 text-xs font-medium text-on-primary shadow-sm"
            >
              {getMainAction(customer.status)}
            </button>

            <button
              type="button"
              className="flex-1 rounded-xl border border-outline/30 bg-surface-container-lowest py-2 text-xs font-medium text-on-surface"
            >
              View Details
            </button>

            <button
              type="button"
              aria-label={`More actions for ${customer.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-outline/30 text-on-surface-variant"
            >
              <MoreHorizontal size={17} />
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}