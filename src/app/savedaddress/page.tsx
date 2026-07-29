"use client";

import { useState } from "react";

import Navbar2 from "@/components/shared/Navbar2";
import AddressHeader from "@/components/savedaddress/AddressHeader";
import AddressList from "@/components/savedaddress/AddressList";
import AddressForm from "@/components/savedaddress/AddressForm";


export default function AddressPage() {

  const [showForm, setShowForm] = useState(false);

  return (
    <main className="pb-24">
      <Navbar2 />
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