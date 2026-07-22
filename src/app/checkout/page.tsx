import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import ContactInformation from "@/components/checkout/ContactInformation";
import DeliveryAddress from "@/components/checkout/DeliveryAddress";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";
import TrustElements from "@/components/checkout/TrustElement";
import PlaceOrderButton from "@/components/checkout/PlaceOrderButton";

export default function CheckoutPage() {
    return (
        <main className="
            min-h-screen
            bg-background
        ">
            <CheckoutHeader />

            <div className="
                px-5
                py-6
                max-w-6xl
                mx-auto
            ">
                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-12
                    gap-6
                ">

                    {/* Left */}
                    <div className="
                        lg:col-span-7
                        flex
                        flex-col
                        gap-6
                    ">
                        <ContactInformation />
                        <DeliveryAddress />
                        <PaymentMethod />
                    </div>


                    {/* Right */}
                    <aside className="
                        lg:col-span-5
                    ">
                        <OrderSummary />
                        <TrustElements />
                    </aside>
                </div>
            </div>
            <PlaceOrderButton />
        </main>
    )
}