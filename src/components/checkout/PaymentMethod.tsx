"use client";

import {
    CreditCard,
    Wallet,
} from "lucide-react";

import {
    useState
} from "react";

export default function PaymentMethod() {
    
    const [payment, setPayment] = useState<"card" | "paypal">("card");

    return (
        <section className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            shadow-[0px_4px_12px_rgba(132, 81, 69, 0.05)]
        ">
            <h2 className="
                text-lg
                font-semibold
                font-display
                text-on-surface
                mb-5
            ">
                Payment Method
            </h2>

            {/* payment options */}
            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
            ">
                {/* credit card */}
                <button 
                    type="button"
                    onClick={() => setPayment("card")}
                    className={`
                        flex
                        items-center
                        gap-3
                        p-4
                        rounded-xl
                        border
                        transition

                        ${
                            payment === "card"
                            ? "border-primary bg-primary-fixed/20"
                            : "border-outline"
                        }
                    `}
                >
                    <CreditCard
                        size={20}
                        className="text-on-surface-variant"
                    />

                    <span className="
                        font-semibold
                        text-sm
                    ">
                        Credit Card
                    </span>
                </button>

                {/* paypal */}
                <button
                    type="button"
                    onClick={() => setPayment("paypal")}
                    className={`
                        flex
                        items-center
                        gap-3
                        p-4
                        rounded-xl
                        border
                        transition
                        
                        ${
                            payment === "paypal"
                            ? "border primary bg-primary-fixed/20"
                            : "border-outline"
                        }
                    `}
                >
                    <Wallet
                        size={20}
                        className="text-on-surface-variant"
                    />

                    <span className="
                        font-semibold
                        text-sm
                    ">
                        PayPal
                    </span>
                </button>
            </div>

            {
                payment === "card" && (
                    <div className="
                        mt-8
                        space-y-4
                    ">
                        {/* card number */}
                        <div className="
                            flex
                            flex-col
                            gap-2
                        ">
                            <label className="
                                text-xs
                                font-semibold
                                text-on-surface-variant
                            ">
                                Card Number
                            </label>

                            <input 
                                placeholder="0000 0000 0000 0000"
                                className="
                                    w-full
                                    bg-surface-container
                                    rounded-lg
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-primary
                                "
                            />
                        </div>

                        {/* expirt + cvc */}
                        <div className="
                            grid
                            grid-cols-2
                            gap-4
                        ">
                            <input  
                                placeholder="MM/YY"
                                className="
                                    bg-surface-container
                                    rounded-lg
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-primary
                                "
                            />
                            <input  
                                placeholder="123"
                                className="
                                    bg-surface-container
                                    rounded-lg
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-primary
                                "
                            />
                        </div>
                    </div>
                )
            }
        </section>
    )
}