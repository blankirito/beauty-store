import Navbar2 from "@/components/shared/Navbar2";
import OrderDetailHeader from "@/components/order/detail/OrderDetailHeader";
import OrderTimeLine from "@/components/order/detail/OrderTimeLine";
import OrderItems from "@/components/order/detail/OrderItems";
import OrderSummary from "@/components/order/detail/OrderSummary";
import ShippingInfo from "@/components/order/detail/ShippingInfo";
import PaymentInfo from "@/components/order/detail/PaymentInfo";
import { getCustomerOrder } from "@/data/customerOrders";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = getCustomerOrder(id);

  if (!order) {
    notFound();
  }

  const orderItems = order.items.flatMap((item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === item.productId,
    );

    return product ? [{ product, quantity: item.quantity }] : [];
  });

  return (
    <main className="pb-24">
      <Navbar2 />

      <section className="space-y-8 px-5 pt-10 lg:px-16">
        <OrderDetailHeader
          orderId={order.id}
          date={order.date}
          status={order.status}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-12 lg:col-span-7">
            <OrderTimeLine steps={order.trackingSteps} />
            <OrderItems items={orderItems} />
          </div>

          <div className="space-y-8 lg:col-span-5">
            <OrderSummary
              subtotal={order.subtotal}
              shipping={order.shipping}
              tax={order.tax}
              total={order.total}
            />

            <div className="grid gap-8 md:grid-cols-2">
              <ShippingInfo
                name={order.shippingAddress.name}
                address={[
                  order.shippingAddress.street,
                  `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
                  order.shippingAddress.country,
                ]}
              />

              <PaymentInfo
                method={order.paymentMethod}
                description={order.paymentDescription}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}