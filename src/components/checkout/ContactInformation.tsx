import {
    Mail,
} from "lucide-react";

export default function ContactInformation() {
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
                    text-on-surface
                    font-display
                ">
                    Contact Information
                </h2>

                <Mail 
                    size={20}
                    className="text-outline"
                />
            </div>
            
            {/* email */}
            <div className="
                flex
                flex-col
                gap-1
                mb-4
            ">
                <label className="
                    text-xs
                    font-semibold
                    tracking-wide
                    text-on-surface-variant
                ">
                    Email Address
                </label>

                <input 
                    type="email"
                    value="alex@gmail.com"
                    readOnly
                    className="
                        w-full
                        bg-surface-container
                        border-none
                        rounded-lg
                        px-4
                        py-3
                        text-on-surface
                        focus:ring-2
                        foxus:ring-primary
                    "
                />
            </div>

            {/* phone */}
            <div className="
                flex
                flex-col
                gap-1
            ">
                <label className="
                    text-xs
                    font-semibold
                    tracking-wide
                    text-on-surface-variant
                ">
                    Phone Number
                </label>

                <input 
                    type="tel"
                    value="+60 12-345 6789"
                    readOnly
                    className="
                        w-full
                        bg-surface-container
                        border-none
                        rounded-lg
                        px-4
                        py-3
                        text-on-surface
                        focus:ring-2
                        focus:ring-primary
                    "
                />
            </div>
        </section>
    )
}