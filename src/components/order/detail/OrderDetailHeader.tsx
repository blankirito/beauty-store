import type { CustomerOrderStatus } from "@/data/customerOrders";

type OrderDetailHeaderProps = {
  orderId: string;
  date: string;
  status: CustomerOrderStatus;
};

function getStatusClass(status: CustomerOrderStatus) {
  if (status === "Pending") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (status === "Processing") {
    return "bg-primary-container/35 text-on-primary-container";
  }

  if (status === "Shipping") {
    return "bg-primary text-on-primary";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function OrderDetailHeader({
  orderId,
  date,
  status,
}: OrderDetailHeaderProps) {
  return (
    <section className="mb-10 text-center">
      <h1 className="mb-3 font-display text-3xl text-on-surface md:text-4xl">
        Order #{orderId}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-on-surface-variant">
        <span>Placed on {date}</span>

        <span
          aria-hidden="true"
          className="h-1 w-1 rounded-full bg-surface-container-highest"
        />

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
            status,
          )}`}
        >
          {status}
        </span>
      </div>
    </section>
  );
}