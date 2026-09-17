import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

const popularProducts = [
  {
    id: 1,
    name: "Glow Serum",
    sales: 124,
    revenue: "RM89.00",
    stock: "In stock",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  },
  {
    id: 2,
    name: "Vitamin C Serum",
    sales: 98,
    revenue: "RM45.00",
    stock: "In stock",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 3,
    name: "Hydrating Face Cream",
    sales: 87,
    revenue: "RM185.00",
    stock: "In stock",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
  },
  {
    id: 4,
    name: "Gentle Facial Cleanser",
    sales: 64,
    revenue: "RM39.00",
    stock: "Low stock",
    image: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24",
  },
];

export default function PopularProducts() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Curation
          </p>
          <h2 className="font-display text-2xl text-on-surface">
            Popular Products
          </h2>
        </div>

        <Link
          href="/admin/products"
          className="flex h-9 items-center gap-1 rounded-full bg-surface-container px-3 text-xs font-semibold text-primary transition-colors hover:bg-surface-container-high"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-2.5">
        {popularProducts.map((product) => (
          <article
            key={product.id}
            className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="h-12 w-12 flex-shrink-0 rounded-lg bg-surface-container object-cover"
              />

              <div className="min-w-0">
                <h3 className="truncate font-medium text-on-surface">
                  {product.name}
                </h3>

                <p className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-variant">
                  <Tag size={14} className="text-primary" />
                  {product.sales} sales
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 pl-3 text-right">
              <p className="text-sm font-semibold text-on-surface">
                {product.revenue}
              </p>

              <p
                className={
                  product.stock === "Low stock"
                    ? "text-xs text-on-surface-variant"
                    : "text-xs text-primary"
                }
              >
                {product.stock}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}