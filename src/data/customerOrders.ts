export type CustomerOrderStatus =
  | "Pending"
  | "Processing"
  | "Shipping"
  | "Completed";

export type CustomerOrderItem = {
  productId: number;
  quantity: number;
};

export type CustomerTrackingStep = {
  title: string;
  date: string;
  status: "completed" | "current" | "pending";
  courier?: string;
  tracking?: string;
  description?: string;
};

export type CustomerOrder = {
  id: string;
  status: CustomerOrderStatus;
  date: string;
  estimatedDelivery: string;
  paymentMethod: string;
  paymentDescription: string;
  items: CustomerOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingSteps: CustomerTrackingStep[];
};

export const customerOrders: CustomerOrder[] = [
  {
    id: "BTQ-102938",
    status: "Shipping",
    date: "20 Oct 2026",
    estimatedDelivery: "24 Oct 2026",
    paymentMethod: "Visa ending in 4242",
    paymentDescription: "Billing address matches shipping address",
    items: [
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 9,
        quantity: 1,
      },
    ],
    subtotal: 131,
    shipping: 0,
    tax: 10.48,
    total: 141.48,
    shippingAddress: {
      name: "Alex Morgan",
      street: "18 Jalan Damai",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "55000",
      country: "Malaysia",
    },
    trackingSteps: [
      {
        title: "Order Placed",
        date: "20 Oct 2026 · 09:45 AM",
        status: "completed",
      },
      {
        title: "Processing",
        date: "21 Oct 2026 · 02:15 PM",
        status: "completed",
      },
      {
        title: "In Transit",
        date: "22 Oct 2026 · 08:30 AM",
        status: "current",
        courier: "Elite Logistics",
        tracking: "EL-9920-112",
        description: "Package arrived at the local sorting facility.",
      },
      {
        title: "Delivered",
        date: "Pending",
        status: "pending",
      },
    ],
  },

  {
    id: "BTQ-102801",
    status: "Completed",
    date: "14 Oct 2026",
    estimatedDelivery: "17 Oct 2026",
    paymentMethod: "Mastercard ending in 0012",
    paymentDescription: "Billing address matches shipping address",
    items: [
      {
        productId: 3,
        quantity: 1,
      },
    ],
    subtotal: 185,
    shipping: 0,
    tax: 14.8,
    total: 199.8,
    shippingAddress: {
      name: "Alex Morgan",
      street: "18 Jalan Damai",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "55000",
      country: "Malaysia",
    },
    trackingSteps: [
      {
        title: "Order Placed",
        date: "14 Oct 2026 · 10:20 AM",
        status: "completed",
      },
      {
        title: "Processing",
        date: "14 Oct 2026 · 03:05 PM",
        status: "completed",
      },
      {
        title: "In Transit",
        date: "15 Oct 2026 · 09:10 AM",
        status: "completed",
        courier: "Elite Logistics",
        tracking: "EL-9916-504",
        description: "Package left the local sorting facility.",
      },
      {
        title: "Delivered",
        date: "17 Oct 2026 · 01:32 PM",
        status: "completed",
      },
    ],
  },

  {
    id: "BTQ-102655",
    status: "Processing",
    date: "23 Oct 2026",
    estimatedDelivery: "27 Oct 2026",
    paymentMethod: "PayPal",
    paymentDescription: "Paid securely through PayPal",
    items: [
      {
        productId: 2,
        quantity: 1,
      },
      {
        productId: 7,
        quantity: 1,
      },
    ],
    subtotal: 74,
    shipping: 0,
    tax: 5.92,
    total: 79.92,
    shippingAddress: {
      name: "Alex Morgan",
      street: "18 Jalan Damai",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "55000",
      country: "Malaysia",
    },
    trackingSteps: [
      {
        title: "Order Placed",
        date: "23 Oct 2026 · 11:40 AM",
        status: "completed",
      },
      {
        title: "Processing",
        date: "23 Oct 2026 · 02:10 PM",
        status: "current",
        description: "Your items are being carefully prepared for shipment.",
      },
      {
        title: "In Transit",
        date: "Pending",
        status: "pending",
      },
      {
        title: "Delivered",
        date: "Pending",
        status: "pending",
      },
    ],
  },

  {
    id: "BTQ-102403",
    status: "Pending",
    date: "24 Oct 2026",
    estimatedDelivery: "29 Oct 2026",
    paymentMethod: "Visa ending in 4242",
    paymentDescription: "Payment is awaiting confirmation",
    items: [
      {
        productId: 6,
        quantity: 1,
      },
    ],
    subtotal: 75,
    shipping: 0,
    tax: 6,
    total: 81,
    shippingAddress: {
      name: "Alex Morgan",
      street: "18 Jalan Damai",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "55000",
      country: "Malaysia",
    },
    trackingSteps: [
      {
        title: "Order Placed",
        date: "24 Oct 2026 · 08:55 AM",
        status: "current",
        description: "We are confirming your payment and order details.",
      },
      {
        title: "Processing",
        date: "Pending",
        status: "pending",
      },
      {
        title: "In Transit",
        date: "Pending",
        status: "pending",
      },
      {
        title: "Delivered",
        date: "Pending",
        status: "pending",
      },
    ],
  },
];

export function getCustomerOrder(orderId: string) {
  return customerOrders.find((order) => order.id === orderId);
}