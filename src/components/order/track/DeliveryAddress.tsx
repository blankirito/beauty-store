import { MapPin } from "lucide-react";

export default function DeliveryAddress() {
    return (
        <section className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            shadow-sm
        ">
            <h3 className="
                text-xl
                font-display
                text-on-surface
                mb-5
            ">Delivery Address</h3>

            <div className="
                flex
                gap-4
                items-start
            ">
                <div className="
                    w-10
                    h-10
                    rounded-full
                    bg-surface-container
                    flex
                    items-center
                    justify-center
                    shrink-0
                ">
                    <MapPin 
                        size={20}
                        className="text-primary"
                    />
                </div>

                <div>
                    <p className="
                        font-medium
                        text-on-surface
                    ">Home</p>

                    <p className="
                        mt-1
                        text-sm
                        text-on-surface-variant
                        leading-relaxed
                    ">
                        123 Serenity Lane, Apt 4B
                        <br />
                        Beverly Hills, CA 90210                        
                    </p>
                </div>
            </div>
        </section>
    )
}