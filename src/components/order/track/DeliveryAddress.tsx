import { MapPin } from "lucide-react";

type DeliveryAddressProps = {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export default function DeliveryAddress({
  name,
  address,
}: DeliveryAddressProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <h3 className="mb-5 font-display text-xl text-on-surface">
        Delivery Address
      </h3>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-container">
          <MapPin size={20} className="text-primary" />
        </div>

        <div className="text-sm leading-relaxed text-on-surface-variant">
          <p className="font-medium text-on-surface">{name}</p>
          <p className="mt-1">{address.street}</p>
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
        </div>
      </div>
    </section>
  );
}