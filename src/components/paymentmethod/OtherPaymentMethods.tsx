import { Wallet, CreditCard, Building2 } from "lucide-react";
import PaymentMethodItem from "./PaymentMethodItem";

const methods = [
  { name: "Apple Pay", icon: Wallet },
  { name: "PayPal", icon: CreditCard },
  { name: "Online Banking", icon: Building2 },
];

type OtherPaymentMethodsProps = {
  selectedPaymentId: string;
  onSelect: (paymentId: string) => void;
};

export default function OtherPaymentMethods({
  selectedPaymentId,
  onSelect,
}: OtherPaymentMethodsProps) {
  return (
    <section className="space-y-6">
      <h2 className="font-display text-2xl text-primary">Other Methods</h2>

      <div className="overflow-hidden rounded-xl border border-outline/30 bg-surface-container-lowest">
        {methods.map((method) => (
          <PaymentMethodItem
            key={method.name}
            name={method.name}
            icon={method.icon}
            selected={selectedPaymentId === method.name}
            onClick={() => onSelect(method.name)}
          />
        ))}
      </div>
    </section>
  );
}