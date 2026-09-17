export type OrderStatus =
  | "New"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type AdminOrder = {
  id: string;
  status: OrderStatus;
  date: string;
  customerName: string;
  customerEmail: string;
  initials: string;
  total: number;
  itemCount: number;
  payment: string;
};

export const adminOrders: AdminOrder[] = [
  {
    id: "ORD-9421",
    status: "New",
    date: "24 Oct 2026 · 10:42 AM",
    customerName: "Alex Stone",
    customerEmail: "alex.stone@email.com",
    initials: "AS",
    total: 142,
    itemCount: 2,
    payment: "Visa ••4242",
  },
  {
    id: "ORD-9420",
    status: "Processing",
    date: "23 Oct 2026 · 04:15 PM",
    customerName: "Maria Lopez",
    customerEmail: "m.lopez@example.com",
    initials: "ML",
    total: 89.5,
    itemCount: 1,
    payment: "MC ••0012",
  },
  {
    id: "ORD-9418",
    status: "Shipped",
    date: "23 Oct 2026 · 01:02 PM",
    customerName: "James Knight",
    customerEmail: "jk.design@domain.com",
    initials: "JK",
    total: 540.22,
    itemCount: 4,
    payment: "PayPal",
  },
  {
    id: "ORD-9415",
    status: "Delivered",
    date: "22 Oct 2026 · 11:30 AM",
    customerName: "Emma Miller",
    customerEmail: "emma.m@example.com",
    initials: "EM",
    total: 85,
    itemCount: 1,
    payment: "Apple Pay",
  },
  {
    id: "ORD-9412",
    status: "Cancelled",
    date: "21 Oct 2026 · 09:15 AM",
    customerName: "Sarah White",
    customerEmail: "s.white@example.com",
    initials: "SW",
    total: 120,
    itemCount: 2,
    payment: "Refunded",
  },
];