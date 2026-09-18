import type { CustomerOrderStatus } from "@/data/customerOrders";

export type OrderFilter = "All" | CustomerOrderStatus;

type OrderTabsProps = {
  selectedStatus: OrderFilter;
  onStatusChange: (status: OrderFilter) => void;
};

const tabs: OrderFilter[] = [
  "All",
  "Pending",
  "Processing",
  "Shipping",
  "Completed",
];

export default function OrderTabs({
  selectedStatus,
  onStatusChange,
}: OrderTabsProps) {
  return (
    <section className="sticky top-16 z-40 border-b border-outline bg-background">
      <div className="no-scrollbar flex overflow-x-auto px-5">
        {tabs.map((tab) => {
          const isActive = selectedStatus === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onStatusChange(tab)}
              className={
                isActive
                  ? "whitespace-nowrap border-b-2 border-primary px-4 py-4 text-sm font-semibold text-primary transition"
                  : "whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
              }
            >
              {tab}
            </button>
          );
        })}
      </div>
    </section>
  );
}