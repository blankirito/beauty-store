export type AdminCustomerStatus = "VIP" | "Active" | "New" | "Inactive";

type DatabaseShippingAddress = {
    city: string;
    country: string;
};

type DatabaseCustomerReportingOrder = {
    customer_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    total: number;
    payment_status: string;
    fulfillment_status: string;
    created_at: string;
    order_shipping_addresses?:
    | DatabaseShippingAddress
    | DatabaseShippingAddress[]
    | null;
};

type CustomerReportingOrder = {
    customerId: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    total: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
    location: string;
};

export type AdminReportingCustomer = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    location: string;
    orderCount: number;
    totalSpent: number;
    isGuest: boolean;
    firstOrderAt: string;
    lastOrderAt: string;
    status?: AdminCustomerStatus;
};

export function toCustomerReportingOrder(
    order: DatabaseCustomerReportingOrder,
): CustomerReportingOrder {
    const addresses = order.order_shipping_addresses;

    const address = Array.isArray(addresses)
        ? addresses[0]
        : addresses;

    const location = [address?.city, address?.country]
        .filter(Boolean)
        .join(", ");

    return {
        customerId: order.customer_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        total: order.total,
        paymentStatus: order.payment_status,
        fulfillmentStatus: order.fulfillment_status,
        createdAt: order.created_at,
        location: location || "Location unavailable",
    };
}

function isValidCustomerOrder(order: CustomerReportingOrder) {
    return (
        order.paymentStatus === "paid" &&
        order.fulfillmentStatus !== "cancelled"
    );
}

function getCustomerStatus(
    customer: AdminReportingCustomer,
    currentDate: Date,
): AdminCustomerStatus {
    const firstOrderDate = new Date(customer.firstOrderAt);
    const isNewThisMonth =
        firstOrderDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
        firstOrderDate.getUTCMonth() === currentDate.getUTCMonth();

    if (isNewThisMonth) {
        return "New";
    }

    if (customer.totalSpent >= 1000) {
        return "VIP";
    }

    const ninetyDaysAgo =
        currentDate.getTime() - 90 * 24 * 60 * 60 * 1000;

    if (new Date(customer.lastOrderAt).getTime() >= ninetyDaysAgo) {
        return "Active";
    }

    return customer.isGuest ? "Active" : "Inactive";
}

export function getAdminCustomerProfileId(
    customerId: string | null,
    customerEmail: string,
) {
    return customerId ?? `guest:${customerEmail.trim().toLowerCase()}`;
}

export function buildAdminCustomers(
    orders: CustomerReportingOrder[],
    currentDate: Date,
): AdminReportingCustomer[] {
    const customers = new Map<string, AdminReportingCustomer>();

    orders.filter(isValidCustomerOrder).forEach((order) => {
        const normalizedEmail = order.customerEmail.trim().toLowerCase();
        const id = getAdminCustomerProfileId(
            order.customerId,
            normalizedEmail,
        );
        const existing = customers.get(id);

        if (!existing) {
            customers.set(id, {
                id,
                name: order.customerName,
                email: normalizedEmail,
                phone: order.customerPhone,
                location: order.location,
                orderCount: 1,
                totalSpent: order.total,
                isGuest: order.customerId === null,
                firstOrderAt: order.createdAt,
                lastOrderAt: order.createdAt,
            });

            return;
        }

        const isNewerOrder =
            new Date(order.createdAt).getTime() >
            new Date(existing.lastOrderAt).getTime();

        customers.set(id, {
            ...existing,
            name: isNewerOrder ? order.customerName : existing.name,
            phone: isNewerOrder ? order.customerPhone : existing.phone,
            location: isNewerOrder ? order.location : existing.location,
            orderCount: existing.orderCount + 1,
            totalSpent: existing.totalSpent + order.total,
            firstOrderAt:
                new Date(order.createdAt).getTime() <
                    new Date(existing.firstOrderAt).getTime()
                    ? order.createdAt
                    : existing.firstOrderAt,
            lastOrderAt: isNewerOrder ? order.createdAt : existing.lastOrderAt,
        });
    });

    return [...customers.values()]
        .map((customer) => ({
            ...customer,
            status: getCustomerStatus(customer, currentDate),
        }))
        .sort(
            (first, second) =>
                new Date(second.lastOrderAt).getTime() -
                new Date(first.lastOrderAt).getTime(),
        );
}

export function buildAdminCustomerMetrics(
    customers: AdminReportingCustomer[],
) {
    return {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(
            (customer) => customer.status === "Active",
        ).length,
        newCustomers: customers.filter(
            (customer) => customer.status === "New",
        ).length,
        vipCustomers: customers.filter(
            (customer) => customer.status === "VIP",
        ).length,
    };
}

export function getCustomerRetentionMetrics(
  customers: Array<Pick<AdminReportingCustomer, "orderCount">>,
) {
  const totalCustomers = customers.length;
  const returningCustomers = customers.filter(
    (customer) => customer.orderCount >= 2,
  ).length;

  return {
    totalCustomers,
    returningCustomers,
    retentionRate:
      totalCustomers > 0
        ? Math.round((returningCustomers / totalCustomers) * 100)
        : 0,
  };
}