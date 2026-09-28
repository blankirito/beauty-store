"use client";

import { useState } from "react";
import type {
  AdminCustomerStatus,
  AdminReportingCustomer,
} from "@/lib/admin/adminCustomerReporting";
import CustomerFilters from "./CustomerFilters";
import CustomerList from "./CustomerList";
import CustomersToolbar from "./CustomersToolbar";

type CustomerFilter = "All" | AdminCustomerStatus;

type CustomersClientProps = {
  customers: AdminReportingCustomer[];
};

export default function CustomersClient({
  customers,
}: CustomersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<CustomerFilter>("All");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.id.toLowerCase().includes(normalizedQuery) ||
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.email.toLowerCase().includes(normalizedQuery) ||
      customer.phone?.toLowerCase().includes(normalizedQuery) === true;

    const matchesStatus =
      selectedStatus === "All" || customer.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <CustomersToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <CustomerFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalCustomers={filteredCustomers.length}
      />

      <CustomerList items={filteredCustomers} />
    </div>
  );
}