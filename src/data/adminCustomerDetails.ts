export type AdminCustomerDetail = {
  phone: string;
  accountCreated: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export const adminCustomerDetailsById: Record<
  string,
  AdminCustomerDetail
> = {
  "CUST-1051": {
    phone: "+60 12-345 6789",
    accountCreated: "Oct 20, 2026 · 09:15 AM",
    address: {
      street: "18 Jalan Damai",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "55000",
      country: "Malaysia",
    },
  },
  "CUST-1050": {
    phone: "+60 13-778 1024",
    accountCreated: "Sep 12, 2025 · 03:40 PM",
    address: {
      street: "8 Jalan Telawi",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      postalCode: "59100",
      country: "Malaysia",
    },
  },
  "CUST-1048": {
    phone: "+1 (415) 555-0184",
    accountCreated: "Jan 14, 2023 · 11:20 AM",
    address: {
      street: "420 Montgomery Street, Suite 800",
      city: "San Francisco",
      state: "CA",
      postalCode: "94104",
      country: "United States",
    },
  },
  "CUST-1042": {
    phone: "+1 (212) 555-0162",
    accountCreated: "Mar 8, 2023 · 09:45 AM",
    address: {
      street: "88 Madison Avenue",
      city: "New York",
      state: "NY",
      postalCode: "10016",
      country: "United States",
    },
  },
  "CUST-1039": {
    phone: "+60 17-882 0193",
    accountCreated: "Nov 18, 2022 · 02:10 PM",
    address: {
      street: "42 Jalan Tun Razak",
      city: "Petaling Jaya",
      state: "Selangor",
      postalCode: "46200",
      country: "Malaysia",
    },
  },
  "CUST-1035": {
    phone: "+60 11-5401 2398",
    accountCreated: "Oct 3, 2026 · 10:05 AM",
    address: {
      street: "7 Persiaran Tropicana",
      city: "Shah Alam",
      state: "Selangor",
      postalCode: "40150",
      country: "Malaysia",
    },
  },
  "CUST-1028": {
    phone: "+1 (206) 555-0149",
    accountCreated: "Jun 22, 2023 · 04:30 PM",
    address: {
      street: "101 Pine Street",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
    },
  },
};

const fallbackCustomerDetail: AdminCustomerDetail = {
  phone: "Phone number unavailable",
  accountCreated: "Account creation date unavailable",
  address: {
    street: "Address unavailable",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
};

export function getAdminCustomerDetail(
  customerId: string,
): AdminCustomerDetail {
  return adminCustomerDetailsById[customerId] ?? fallbackCustomerDetail;
}