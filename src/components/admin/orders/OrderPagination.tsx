import { ChevronLeft, ChevronRight } from "lucide-react";

type OrderPaginationProps = {
  totalOrders: number;
};

export default function OrderPagination({
  totalOrders,
}: OrderPaginationProps) {
  const ordersPerPage = 5;
  const displayedOrders = Math.min(totalOrders, ordersPerPage);

  return (
    <section className="flex items-center justify-between pt-2">
      <p className="text-xs font-medium text-on-surface-variant">
        {totalOrders === 0
          ? "No orders found"
          : `Showing 1 to ${displayedOrders} of ${totalOrders} orders`}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled
          className="flex items-center gap-1 rounded-xl bg-surface-container px-3.5 py-2 text-xs font-semibold text-on-surface-variant opacity-50"
        >
          <ChevronLeft size={15} />
          Prev
        </button>

        <button
          type="button"
          disabled={totalOrders <= ordersPerPage}
          className="flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-sm disabled:opacity-40"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}