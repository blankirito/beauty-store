import Navbar2 from "@/components/shared/Navbar2";
import TrackHeader from "@/components/order/track/TrackHeader";
import OrderTimeline from "@/components/order/track/OrderTimeLine";
import DeliveryAddress from "@/components/order/track/DeliveryAddress";

import {trackingSteps} from "@/data/orderTracking";

export default function TrackOrderPage() {
    return (
        <main className="pb-24">
            <Navbar2 />
            <div
                className="
                    px-5
                    pt-8
                    space-y-8
                "
            >
            <TrackHeader
                orderId="BTQ-102938"
                status="In Transit"
                deliveryDate="Oct 24, 2026"
            />
            <OrderTimeline
                steps={trackingSteps}
            />
            <DeliveryAddress/>
            </div>

        </main>
    )
}