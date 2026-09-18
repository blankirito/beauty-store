import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import ContactInformation from "@/components/checkout/ContactInformation";
import DeliveryAddress from "@/components/checkout/DeliveryAddress";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";
import TrustElements from "@/components/checkout/TrustElement";
import PlaceOrderButton from "@/components/checkout/PlaceOrderButton";

type CheckoutPageProps = {
  searchParams: Promise<{
    product?: string;
    quantity?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { product, quantity } = await searchParams;

  const parsedProductId = Number(product);
  const parsedQuantity = Number(quantity);

  const buyNowProductId =
    Number.isInteger(parsedProductId) && parsedProductId > 0
      ? parsedProductId
      : undefined;

  const buyNowQuantity =
    Number.isInteger(parsedQuantity) && parsedQuantity > 0
      ? parsedQuantity
      : 1;

  return (
    <main className="min-h-screen bg-background">
      <CheckoutHeader />

      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <ContactInformation />
            <DeliveryAddress />
            <PaymentMethod />
          </div>

          <aside className="lg:col-span-5">
            <OrderSummary
              buyNowProductId={buyNowProductId}
              buyNowQuantity={buyNowQuantity}
            />
            <TrustElements />
          </aside>
        </div>
      </div>

      <PlaceOrderButton
        buyNowProductId={buyNowProductId}
        buyNowQuantity={buyNowQuantity}
      />
    </main>
  );
}