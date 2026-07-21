import { Address } from "@/types/address";
import AddressCard from "./AddressCard";

const addresses: Address[] = [
  {
    id: 1,
    label: "Home",
    name: "Lee Chong Yu",
    phone: "+60 12-345 6789",
    address: "42 Serenity Lane",
    city: "Johor Bahru",
    state: "Johor",
    postcode: "80000",
    country: "Malaysia",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    name: "Lee Chong Yu",
    phone: "+60 11-222 3333",
    address: "Tech Park Avenue",
    city: "Penang",
    state: "Pulau Pinang",
    postcode: "14000",
    country: "Malaysia",
    isDefault: false,
  },
];

export default function AddressList(){
    return (
        <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
          px-5
        "
      >
        {
          addresses.map((address)=>(
            <AddressCard
              key={address.id}
              address={address}
            />
          ))
        }
      </div>
    )
}