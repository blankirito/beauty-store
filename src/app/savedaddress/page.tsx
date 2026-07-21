"use client";

import { useState } from "react";

import Navbar from "@/components/shared/Navbar";
import AddressHeader from "@/components/savedaddress/AddressHeader";
import AddressList from "@/components/savedaddress/AddressList";
import AddressForm from "@/components/savedaddress/AddressForm";


export default function AddressPage() {

  const [showForm, setShowForm] = useState(false);

  return (
    <main className="pb-24">
      <Navbar />
      <AddressHeader
        onAdd={() => setShowForm(true)}
      />
      <AddressList />
      {
        showForm && (
          <AddressForm
            onClose={() => setShowForm(false)}
          />
        )
      }
    </main>
  );
}