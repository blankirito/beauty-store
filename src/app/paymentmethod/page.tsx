import Navbar2 from "@/components/shared/Navbar2"
import PaymentHeader from "@/components/paymentmethod/PaymentHeader"
import SavedCards from "@/components/paymentmethod/SavedCards";
import OtherPaymentMethods from "@/components/paymentmethod/OtherPaymentMethods";
import SavePreferenceButton from "@/components/paymentmethod/SavePreferenceButton";

export default function PaymentMethodPage() {
    return (
        <main className="pb-24">
            <Navbar2 />
            <PaymentHeader />
            <section
                className="
                    max-w-6xl
                    mx-auto
                    space-y-12
                    px-5
                "
            >
               <SavedCards />
               <OtherPaymentMethods />
               <SavePreferenceButton />
            </section>
        </main>
    )
}