export type CustomerStatus = "VIP" | "Active" | "New" | "Inactive";

export type AdminCustomer = {
  id: string;
  status: CustomerStatus;
  memberSince: string;
  name: string;
  email: string;
  initials: string;
  location: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
};

export const adminCustomers: AdminCustomer[] = [
  {
    id: "CUST-1048",
    status: "VIP",
    memberSince: "Jan 2023",
    name: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    initials: "EV",
    location: "San Francisco, CA",
    orderCount: 18,
    totalSpent: 3420.5,
    lastOrder: "2 days ago",
  },
  {
    id: "CUST-1042",
    status: "Active",
    memberSince: "Mar 2023",
    name: "James Sterling",
    email: "james.s@domain.com",
    initials: "JS",
    location: "New York, NY",
    orderCount: 11,
    totalSpent: 1840,
    lastOrder: "24 Oct 2026",
  },
  {
    id: "CUST-1039",
    status: "VIP",
    memberSince: "Nov 2022",
    name: "Maria Lopez",
    email: "m.lopez@example.com",
    initials: "ML",
    location: "Chicago, IL",
    orderCount: 15,
    totalSpent: 2290,
    lastOrder: "23 Oct 2026",
  },
  {
    id: "CUST-1035",
    status: "New",
    memberSince: "Oct 2026",
    name: "James Knight",
    email: "jk.design@domain.com",
    initials: "JK",
    location: "Austin, TX",
    orderCount: 2,
    totalSpent: 682.22,
    lastOrder: "23 Oct 2026",
  },
  {
    id: "CUST-1028",
    status: "Inactive",
    memberSince: "Jun 2023",
    name: "Sarah White",
    email: "s.white@example.com",
    initials: "SW",
    location: "Seattle, WA",
    orderCount: 4,
    totalSpent: 450,
    lastOrder: "94 days ago",
  },
];