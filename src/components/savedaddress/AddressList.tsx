import type { Address } from "@/types/address";
import AddressCard from "./AddressCard";

type AddressListProps = {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => void;
  onSetDefault: (addressId: number) => void;
};

export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={() => onEdit(address)}
          onDelete={() => onDelete(address.id)}
          onSetDefault={() => onSetDefault(address.id)}
        />
      ))}
    </div>
  );
}