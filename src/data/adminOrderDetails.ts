export type AdminOrderItem = {
  productName: string;
  sku: string;
  image: string;
  quantity: number;
  unitPrice: number;
};

export type AdminOrderDetail = {
  customerPhone: string;
  customerId: string;
  paymentStatus: "Paid" | "Refunded";
  subtotal: number;
  shippingFee: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  items: AdminOrderItem[];
};

export const adminOrderDetailsById: Record<string, AdminOrderDetail> = {
  "ORD-9421": {
    customerPhone: "+60 12-345 6789",
    customerId: "CUST-1051",
    paymentStatus: "Paid",
    subtotal: 142,
    shippingFee: 0,
    shippingAddress: {
      street: "18 Jalan Damai",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "55000",
      country: "Malaysia",
    },
    shippingMethod: "Standard Delivery (2–3 days)",
    estimatedDelivery: "28 Oct 2026",
    items: [
      {
        productName: "Glow Serum",
        sku: "LUM-001",
        image:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
        quantity: 1,
        unitPrice: 89,
      },
      {
        productName: "Body Lotion",
        sku: "LUM-009",
        image:
          "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
        quantity: 1,
        unitPrice: 53,
      },
    ],
  },

  "ORD-9420": {
    customerPhone: "+60 17-882 0193",
    customerId: "CUST-1039",
    paymentStatus: "Paid",
    subtotal: 89.5,
    shippingFee: 0,
    shippingAddress: {
      street: "42 Jalan Tun Razak",
      city: "Petaling Jaya",
      state: "Selangor",
      postalCode: "46200",
      country: "Malaysia",
    },
    shippingMethod: "Standard Delivery (2–3 days)",
    estimatedDelivery: "27 Oct 2026",
    items: [
      {
        productName: "Glow Serum",
        sku: "LUM-001",
        image:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
        quantity: 1,
        unitPrice: 89.5,
      },
    ],
  },

  "ORD-9418": {
    customerPhone: "+60 11-5401 2398",
    customerId: "CUST-1035",
    paymentStatus: "Paid",
    subtotal: 540.22,
    shippingFee: 0,
    shippingAddress: {
      street: "7 Persiaran Tropicana",
      city: "Shah Alam",
      state: "Selangor",
      postalCode: "40150",
      country: "Malaysia",
    },
    shippingMethod: "Express Delivery (1–2 days)",
    trackingNumber: "MYX-4829-1108",
    estimatedDelivery: "25 Oct 2026",
    items: [
      {
        productName: "Hydrating Face Cream",
        sku: "LUM-003",
        image:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
        quantity: 2,
        unitPrice: 185,
      },
      {
        productName: "Hair Treatment Oil",
        sku: "LUM-006",
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
        quantity: 2,
        unitPrice: 85.11,
      },
    ],
  },

  "ORD-9415": {
    customerPhone: "+60 13-778 1024",
    customerId: "CUST-1050",
    paymentStatus: "Paid",
    subtotal: 85,
    shippingFee: 0,
    shippingAddress: {
      street: "8 Jalan Telawi",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "59100",
      country: "Malaysia",
    },
    shippingMethod: "Standard Delivery (2–3 days)",
    estimatedDelivery: "26 Oct 2026",
    items: [
      {
        productName: "Body Lotion",
        sku: "LUM-009",
        image:
          "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
        quantity: 1,
        unitPrice: 85,
      },
    ],
  },

  "ORD-9412": {
    customerPhone: "+1 (206) 555-0149",
    customerId: "CUST-1028",
    paymentStatus: "Refunded",
    subtotal: 120,
    shippingFee: 0,
    shippingAddress: {
      street: "101 Pine Street",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
    },
    shippingMethod: "Standard Delivery (2–3 days)",
    items: [
      {
        productName: "Repair Shampoo",
        sku: "LUM-005",
        image:
          "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388",
        quantity: 1,
        unitPrice: 59,
      },
      {
        productName: "Matte Lipstick",
        sku: "LUM-007",
        image:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
        quantity: 1,
        unitPrice: 61,
      },
    ],
  },
};

const fallbackOrderDetail: AdminOrderDetail = {
  customerPhone: "Phone number unavailable",
  customerId: "",
  paymentStatus: "Paid",
  subtotal: 0,
  shippingFee: 0,
  shippingAddress: {
    street: "Address unavailable",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  shippingMethod: "Standard Delivery",
  items: [],
};

export function getAdminOrderDetail(orderId: string): AdminOrderDetail {
  return adminOrderDetailsById[orderId] ?? fallbackOrderDetail;
}