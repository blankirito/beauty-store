import {
  CheckCircle2,
  Layers3,
  TriangleAlert,
} from "lucide-react";
import type { AdminProduct } from "@/lib/products/adminProduct";
import { getAdminProductMetrics } from "@/lib/products/adminProductMetrics";

type ProductMetricsProps = {
  products: AdminProduct[];
};

export default function ProductMetrics({
  products,
}: ProductMetricsProps) {

  const metrics = getAdminProductMetrics(products);

  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Total Products
          </p>

          <span className="rounded-full bg-primary-container/40 px-1.5 py-0.5 text-[10px] font-semibold text-on-primary-container">
            Current
          </span>
        </div>

        <p className="font-display text-2xl font-bold tracking-tight text-on-surface">
          {products.length}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          In your current catalogue
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            In Stock
          </p>

          <CheckCircle2 size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold tracking-tight text-on-surface">
          {metrics.inStockCount}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Ready for fulfillment
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Low Stock
          </p>

          <TriangleAlert size={17} className="text-error" />
        </div>

        <p className="font-display text-2xl font-bold tracking-tight text-error">
          {metrics.lowStockCount}
        </p>

        <p className="text-[10px] font-medium text-error">
          Restock recommended
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Categories
          </p>

          <Layers3 size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold tracking-tight text-on-surface">
          {metrics.categoryCount}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Active product categories
        </p>
      </article>
    </section>
  );
}