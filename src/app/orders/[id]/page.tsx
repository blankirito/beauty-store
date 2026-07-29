import Navbar from "@/components/shared/Navbar";
import OrderDetailHeader from "@/components/order/detail/OrderDetailHeader";
import OrderTimeLine from "@/components/order/detail/OrderTimeLine";
import OrderItems from "@/components/order/detail/OrderItems";
import OrderSummary from "@/components/order/detail/OrderSummary";
import ShippingInfo from "@/components/order/detail/ShippingInfo";
import PaymentInfo from "@/components/order/detail/PaymentInfo";

import {trackingSteps} from "@/data/orderTracking";

export default function OrderDetailPage() {
    return (
        <main className="
            pb-24
            px-5
            lg:px-16
            space-y-8
        ">
            <Navbar />
            <OrderDetailHeader
                orderId="BTQ-102938"
                date="October 24, 2026"
                status="Confirmed"
            />

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-12
                gap-8
                lg:gap-16
            ">
                <div className="
                    lg:col-span-7
                    space-y-12
                ">
                    <OrderTimeLine 
                        steps={trackingSteps}
                    />
                    <OrderItems />
                </div>

                <div className="
                    lg:col-span-5
                    space-y-8
                ">
                    <OrderSummary 
                        subtotal={210}
                        shipping={15}
                        tax={18.9}
                        total={243.9}
                    />
                    <div className="
                        grid
                        md:grid-cols-2
                        gap-8
                    ">
                        <ShippingInfo 
                            name="Alex Morgan"
                            address={[
                                "1280 Hillside Drive",
                                "Apt 4B",
                                "San Francisco, CA 94114"
                            ]}
                        />
                        <PaymentInfo 
                            method="Visa ending in 4242"
                            description="Billing address matches shipping"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}