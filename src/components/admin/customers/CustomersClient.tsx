"use client";

import { useState } from "react";
import {
  adminCustomers,
  type CustomerStatus,
} from "@/data/adminCustomers";
import CustomerFilters from "./CustomerFilters";
import CustomerList from "./CustomerList";
import CustomersToolbar from "./CustomersToolbar";
import CustomerPagination from "./CustomerPagination";

type CustomerFilter = "All" | CustomerStatus;

export default function CustomersClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<CustomerFilter>("All");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCustomers = adminCustomers.filter((customer) => {
    const matchesSearch =
      customer.id.toLowerCase().includes(normalizedQuery) ||
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.email.toLowerCase().includes(normalizedQuery);

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
      <CustomerPagination totalCustomers={filteredCustomers.length} />
    </div>
  );
}