"use client";

import { useState } from "react";
import type { Address } from "@/types/address";
import Navbar2 from "@/components/shared/Navbar2";
import AddressHeader from "@/components/savedaddress/AddressHeader";
import AddressList from "@/components/savedaddress/AddressList";
import AddressForm from "@/components/savedaddress/AddressForm";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

const initialAddresses: Address[] = [
  {
    id: 1,
    label: "Home",
    name: "Alex Morgan",
    phone: "+60 12-345 6789",
    address: "18 Jalan Damai",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postcode: "55000",
    country: "Malaysia",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    name: "Alex Morgan",
    phone: "+60 11-222 3333",
    address: "88 Jalan Tun Razak",
    city: "Petaling Jaya",
    state: "Selangor",
    postcode: "46200",
    country: "Malaysia",
    isDefault: false,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] =
    useState<Address[]>(initialAddresses);
  const [editingAddress, setEditingAddress] =
    useState<Address | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] =
    useState<number | null>(null);

  function closeForm() {
    setShowForm(false);
    setEditingAddress(undefined);
  }

  function handleSaveAddress(address: Omit<Address, "id">) {
    const shouldBeDefault =
      address.isDefault || editingAddress?.isDefault === true;

    if (editingAddress) {
      setAddresses((currentAddresses) =>
        currentAddresses.map((currentAddress) => {
          if (currentAddress.id === editingAddress.id) {
            return {
              ...address,
              id: editingAddress.id,
              isDefault: shouldBeDefault,
            };
          }

          return shouldBeDefault
            ? { ...currentAddress, isDefault: false }
            : currentAddress;
        }),
      );
    } else {
      setAddresses((currentAddresses) => [
        ...currentAddresses.map((currentAddress) => ({
          ...currentAddress,
          isDefault: shouldBeDefault
            ? false
            : currentAddress.isDefault,
        })),
        {
          ...address,
          id: Date.now(),
          isDefault:
            shouldBeDefault || currentAddresses.length === 0,
        },
      ]);
    }

    closeForm();
  }

  function handleSetDefault(addressId: number) {
    setAddresses((currentAddresses) =>
      currentAddresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    );
  }

  function handleDelete() {
    if (addressIdToDelete === null) return;

    setAddresses((currentAddresses) => {
      const nextAddresses = currentAddresses.filter(
        (address) => address.id !== addressIdToDelete,
      );

      if (
        nextAddresses.length > 0 &&
        !nextAddresses.some((address) => address.isDefault)
      ) {
        return nextAddresses.map((address, index) => ({
          ...address,
          isDefault: index === 0,
        }));
      }

      return nextAddresses;
    });

    setAddressIdToDelete(null);
  }

  return (
    <main className="pb-24">
      <Navbar2 />

      <AddressHeader
        onAdd={() => {
          setEditingAddress(undefined);
          setShowForm(true);
        }}
      />

      <AddressList
        addresses={addresses}
        onEdit={(address) => {
          setEditingAddress(address);
          setShowForm(true);
        }}
        onDelete={setAddressIdToDelete}
        onSetDefault={handleSetDefault}
      />

      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={closeForm}
          onSave={handleSaveAddress}
        />
      )}
      <ConfirmationDialog
        isOpen={addressIdToDelete !== null}
        title="Delete saved address?"
        description="This address will be removed from your saved delivery locations."
        confirmLabel="Delete"
        onCancel={() => setAddressIdToDelete(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}