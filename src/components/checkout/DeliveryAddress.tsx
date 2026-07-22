import {
    MapPin,
} from "lucide-react";

export default function DeliveryAddress() {
    return (
        <section className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            shadow-[0px_4px_12px_rgba(132, 81, 69, 0.05)]
        ">
            {/* header */}
            <div className="
                flex
                justify-between
                items-center
                mb-5
            ">
                <h2 className="
                    text-lg
                    font-semibold
                    font-display
                    text-on-surface
                ">
                    Delivery Address
                </h2>

                <button className="
                    text-primary
                    text-sm
                    font-semibold
                    hover:underline
                ">
                    Edit
                </button>
            </div>
            
            {/* address content */}
            <div className="
                flex
                items-start
                gap-4
            ">
                {/* icon box */}
                <div className="
                    bg-primary-container/20
                    p-3
                    rounded-lg
                    flex
                    items-center
                    justify-center
                ">
                    <MapPin 
                        size={22}
                        className="text-primary"
                    />
                </div>

                {/* address text */}
                <div>
                    <p className="
                        font-semibold
                        text-on-surface
                    ">
                        Alex Morgan
                    </p>

                    <p className="
                        text-on-surface-variant
                        text-sm
                    ">
                        742 Evergreen Terrace
                    </p>

                    <p className="
                        text-on-surface-variant
                        text-sm
                    ">
                        Springfield, IL 62704
                    </p>

                    <p className="
                        text-on-surface-variant
                        text-sm
                    ">
                        United States
                    </p>
                </div>
            </div>
        </section>
    )
}