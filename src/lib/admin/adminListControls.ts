import type { AdminReportingCustomer } from "./adminCustomerReporting";
import type { AdminOrder } from "../orders/adminOrder";
import type { AdminProduct } from "../products/adminProduct";

export type ProductSort =
  | "newest"
  | "oldest"
  | "name_asc"
  | "stock_asc";

export type OrderDateRange = "all" | "last_30_days";

export type OrderSort = "newest" | "oldest";

export type CustomerSort =
  | "highest_spent"
  | "most_recent"
  | "oldest_customer";

export function sortAdminProducts(
  products: AdminProduct[],
  sort: ProductSort,
): AdminProduct[] {
  return [...products].sort((first, second) => {
    if (sort === "name_asc") {
      return first.name.localeCompare(second.name);
    }

    if (sort === "stock_asc") {
      return first.stock - second.stock;
    }

    const firstDate = new Date(first.createdAt).getTime();
    const secondDate = new Date(second.createdAt).getTime();

    return sort === "newest"
      ? secondDate - firstDate
      : firstDate - secondDate;
  });
}

export function filterAndSortAdminOrders(
  orders: AdminOrder[],
  {
    dateRange,
    sort,
    now,
  }: {
    dateRange: OrderDateRange;
    sort: OrderSort;
    now: Date;
  },
): AdminOrder[] {
  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000,
  );

  const visibleOrders =
    dateRange === "last_30_days"
      ? orders.filter(
          (order) =>
            new Date(order.createdAt).getTime() >= thirtyDaysAgo.getTime(),
        )
      : orders;

  return [...visibleOrders].sort((first, second) => {
    const firstDate = new Date(first.createdAt).getTime();
    const secondDate = new Date(second.createdAt).getTime();

    return sort === "newest"
      ? secondDate - firstDate
      : firstDate - secondDate;
  });
}

export function sortAdminCustomers(
  customers: AdminReportingCustomer[],
  sort: CustomerSort,
): AdminReportingCustomer[] {
  return [...customers].sort((first, second) => {
    if (sort === "highest_spent") {
      return second.totalSpent - first.totalSpent;
    }

    const firstDate =
      sort === "most_recent"
        ? new Date(first.lastOrderAt).getTime()
        : new Date(first.firstOrderAt).getTime();

    const secondDate =
      sort === "most_recent"
        ? new Date(second.lastOrderAt).getTime()
        : new Date(second.firstOrderAt).getTime();

    return sort === "most_recent"
      ? secondDate - firstDate
      : firstDate - secondDate;
  });
}

function makeCsvCell(value: string | number) {
  const text = String(value);
  const formulaSafeText =
    /^[=+\-@]/.test(text) ? `'${text}` : text;

  return /[",\r\n]/.test(formulaSafeText)
    ? `"${formulaSafeText.replaceAll('"', '""')}"`
    : formulaSafeText;
}

export function buildAdminOrdersCsv(orders: AdminOrder[]) {
  const header = [
    "Order Number",
    "Date",
    "Customer Name",
    "Customer Email",
    "Fulfilment Status",
    "Payment Status",
    "Payment Method",
    "Total",
  ];

  const rows = orders.map((order) =>
    [
      order.id,
      order.createdAt,
      order.customerName,
      order.customerEmail,
      order.status,
      order.paymentStatus,
      order.payment,
      order.total,
    ]
      .map(makeCsvCell)
      .join(","),
  );

  return [header.join(","), ...rows].join("\r\n");
}