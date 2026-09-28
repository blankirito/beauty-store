type ReportingOrderItem = {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  lineTotal: number;
};

type ReportingOrder = {
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt?: string;
  items?: ReportingOrderItem[];
};

type DatabaseReportingProduct = {
  category: string | null;
};

type DatabaseReportingOrderItem = {
  product_id: string | null;
  product_name: string;
  product_category: string | null;
  quantity: number;
  line_total: number;
  products?: DatabaseReportingProduct | DatabaseReportingProduct[] | null;
};

type DatabaseReportingOrder = {
  total: number;
  payment_status: string;
  fulfillment_status: string;
  created_at?: string;
  order_items?: DatabaseReportingOrderItem[] | null;
};

export function toReportingOrder(
  order: DatabaseReportingOrder,
): ReportingOrder {
  return {
    createdAt: order.created_at,
    total: order.total,
    paymentStatus: order.payment_status,
    fulfillmentStatus: order.fulfillment_status,
    items: (order.order_items ?? []).map((item) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      return {
        productId: item.product_id ?? item.product_name,
        productName: item.product_name,
        category:
          item.product_category ??
          product?.category ??
          "Uncategorized",
        quantity: item.quantity,
        lineTotal: item.line_total,
      };
    }),
  };
}

function isRevenueOrder(order: ReportingOrder) {
  return (
    order.paymentStatus === "paid" &&
    order.fulfillmentStatus !== "cancelled"
  );
}

export function getReportingRevenue(orders: ReportingOrder[]) {
  return orders
    .filter(isRevenueOrder)
    .reduce((total, order) => total + order.total, 0);
}

export function getReportingMetrics(orders: ReportingOrder[]) {
  const paidOrders = orders.filter(isRevenueOrder);
  const revenue = getReportingRevenue(orders);

  return {
    revenue,
    paidOrderCount: paidOrders.length,
    averageOrderValue:
      paidOrders.length > 0 ? revenue / paidOrders.length : 0,
  };
}

export function getTopReportingProducts(orders: ReportingOrder[]) {
  const products = new Map<
    string,
    {
      productId: string;
      productName: string;
      category: string;
      unitsSold: number;
      revenue: number;
    }
  >();

  orders.filter(isRevenueOrder).forEach((order) => {
    order.items?.forEach((item) => {
      const existing = products.get(item.productId);

      products.set(item.productId, {
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        unitsSold: (existing?.unitsSold ?? 0) + item.quantity,
        revenue: (existing?.revenue ?? 0) + item.lineTotal,
      });
    });
  });

  return [...products.values()].sort(
    (first, second) => second.revenue - first.revenue,
  );
}

export function getReportingCategories(orders: ReportingOrder[]) {
  const revenueByCategory = new Map<string, number>();

  orders.filter(isRevenueOrder).forEach((order) => {
    order.items?.forEach((item) => {
      revenueByCategory.set(
        item.category,
        (revenueByCategory.get(item.category) ?? 0) + item.lineTotal,
      );
    });
  });

  const totalRevenue = [...revenueByCategory.values()].reduce(
    (total, revenue) => total + revenue,
    0,
  );

  return [...revenueByCategory.entries()]
    .map(([category, revenue]) => ({
      category,
      revenue,
      percentage:
        totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0,
    }))
    .sort((first, second) => second.revenue - first.revenue);
}

function getMalaysiaCalendarDate(value: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function getReportingRevenueByDay(orders: ReportingOrder[]) {
  const revenueByDay = new Map<string, number>();

  orders.filter(isRevenueOrder).forEach((order) => {
    if (!order.createdAt) {
      return;
    }

    const date = getMalaysiaCalendarDate(order.createdAt);

    revenueByDay.set(
      date,
      (revenueByDay.get(date) ?? 0) + order.total,
    );
  });

  return [...revenueByDay.entries()]
    .map(([date, revenue]) => ({
      date,
      revenue,
    }))
    .sort((first, second) => first.date.localeCompare(second.date));
}

const reportingOrderStatuses = [
  { raw: "new", status: "New" },
  { raw: "processing", status: "Processing" },
  { raw: "shipped", status: "Shipped" },
  { raw: "delivered", status: "Delivered" },
  { raw: "cancelled", status: "Cancelled" },
] as const;

export function getReportingOrderDistribution(
  orders: ReportingOrder[],
) {
  return reportingOrderStatuses.map(({ raw, status }) => ({
    status,
    count: orders.filter(
      (order) => order.fulfillmentStatus === raw,
    ).length,
  }));
}

export type ReportingTimeframe =
  | "7-days"
  | "30-days"
  | "this-month"
  | "this-year";

function getMalaysiaDateParts(currentDate: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(currentDate);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value);

  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
  };
}

function formatMalaysiaBoundary(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00.000+08:00`;
}

export function getReportingDateRange(
  timeframe: ReportingTimeframe,
  currentDate: Date,
) {
  const { year, month, day } = getMalaysiaDateParts(currentDate);
  const today = new Date(Date.UTC(year, month - 1, day));

  if (timeframe === "7-days") {
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - 6);

    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + 1);

    return {
      start: formatMalaysiaBoundary(start),
      end: formatMalaysiaBoundary(end),
    };
  }

  if (timeframe === "30-days") {
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - 29);

    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + 1);

    return {
      start: formatMalaysiaBoundary(start),
      end: formatMalaysiaBoundary(end),
    };
  }

  if (timeframe === "this-year") {
    return {
      start: formatMalaysiaBoundary(new Date(Date.UTC(year, 0, 1))),
      end: formatMalaysiaBoundary(new Date(Date.UTC(year + 1, 0, 1))),
    };
  }

  return {
    start: formatMalaysiaBoundary(new Date(Date.UTC(year, month - 1, 1))),
    end: formatMalaysiaBoundary(new Date(Date.UTC(year, month, 1))),
  };
}

export function filterReportingOrdersByDate(
  orders: ReportingOrder[],
  range: {
    start: string;
    end: string;
  },
) {
  const startTime = new Date(range.start).getTime();
  const endTime = new Date(range.end).getTime();

  return orders.filter((order) => {
    if (!order.createdAt) {
      return false;
    }

    const orderTime = new Date(order.createdAt).getTime();

    return orderTime >= startTime && orderTime < endTime;
  });
}