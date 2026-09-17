import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductPaginationProps = {
  totalProducts: number;
};

export default function ProductPagination({
  totalProducts,
}: ProductPaginationProps) {
  const productsPerPage = 5;
  const displayedProducts = Math.min(totalProducts, productsPerPage);

  return (
    <section className="flex items-center justify-between pt-2">
      <p className="text-xs font-medium text-on-surface-variant">
        {totalProducts === 0
          ? "No products found"
          : `Showing 1 to ${displayedProducts} of ${totalProducts}`}
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
          disabled={totalProducts <= productsPerPage}
          className="flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-on-primary-container disabled:opacity-40"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}