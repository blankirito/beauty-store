import { ChevronLeft, ChevronRight } from "lucide-react";

type OrderPaginationProps = {
  currentPage: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
};

export default function OrderPagination({
  currentPage,
  totalOrders,
  onPageChange,
}: OrderPaginationProps) {
  const ordersPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(totalOrders / ordersPerPage));
  const firstOrder =
    totalOrders === 0 ? 0 : (currentPage - 1) * ordersPerPage + 1;
  const lastOrder = Math.min(currentPage * ordersPerPage, totalOrders);

  return (
    <section className="flex items-center justify-between pt-2">
      <p className="text-xs font-medium text-on-surface-variant">
        {totalOrders === 0
          ? "No orders found"
          : `Showing ${firstOrder} to ${lastOrder} of ${totalOrders} orders`}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 rounded-xl bg-surface-container px-3.5 py-2 text-xs font-semibold text-on-surface-variant opacity-50 enabled:opacity-100"
        >
          <ChevronLeft size={15} />
          Prev
        </button>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-sm disabled:opacity-40"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}