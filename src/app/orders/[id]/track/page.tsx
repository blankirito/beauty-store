import Navbar2 from "@/components/shared/Navbar2";
import DeliveryAddress from "@/components/order/track/DeliveryAddress";
import OrderTimeLine from "@/components/order/track/OrderTimeLine";
import TrackHeader from "@/components/order/track/TrackHeader";
import { getCustomerOrder } from "@/data/customerOrders";
import { notFound } from "next/navigation";

type TrackOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TrackOrderPage({
  params,
}: TrackOrderPageProps) {
  const { id } = await params;
  const order = getCustomerOrder(id);

  if (!order) {
    notFound();
  }

  const currentStep = order.trackingSteps.find(
    (step) => step.status === "current",
  );

  return (
    <main className="pb-24">
      <Navbar2 />

      <div className="space-y-8 px-5 pt-8">
        <TrackHeader
          orderId={order.id}
          status={currentStep?.title ?? order.status}
          deliveryDate={order.estimatedDelivery}
        />

        <OrderTimeLine steps={order.trackingSteps} />

        <DeliveryAddress
          name={order.shippingAddress.name}
          address={order.shippingAddress}
        />
      </div>
    </main>
  );
}