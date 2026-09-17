import { ChevronLeft, ChevronRight } from "lucide-react";

type CustomerPaginationProps = {
  totalCustomers: number;
};

export default function CustomerPagination({
  totalCustomers,
}: CustomerPaginationProps) {
  const customersPerPage = 5;
  const displayedCustomers = Math.min(totalCustomers, customersPerPage);

  return (
    <section className="flex items-center justify-between pt-2">
      <p className="text-xs font-medium text-on-surface-variant">
        {totalCustomers === 0
          ? "No customers found"
          : `Showing 1 to ${displayedCustomers} of ${totalCustomers} customers`}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled
          className="flex items-center gap-1 rounded-xl bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant opacity-50"
        >
          <ChevronLeft size={15} />
          Prev
        </button>

        <button
          type="button"
          disabled={totalCustomers <= customersPerPage}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary shadow-sm disabled:opacity-40"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}