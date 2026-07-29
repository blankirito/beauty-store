"use client";

import { useState } from "react";
import { Wallet, CreditCard, Building2 } from "lucide-react";

import PaymentMethodItem from "./PaymentMethodItem";

const methods =[
    {
        name:"Apple Pay",
        icon:Wallet
    },

    {
        name:"PayPal",
        icon:CreditCard
    },

    {
        name:"Online Banking",
        icon:Building2
    },
]

export default function OtherPaymentMethods() {
    
    const [selected, setSelected] = useState("Apple Pay");

    return (
        <section className="space-y-6">
            <h2 className="
                text-2xl
                font-display
                text-primary
            ">
                Other Methods
            </h2>
            
            <div className="
                bg-surface-container-lowest
                rounded-xl
                overflow-hidden
                border
                border-outline/30
            ">
                {
                    methods.map((method)=>(
                        <PaymentMethodItem
                            key={method.name}
                            name={method.name}
                            icon={method.icon}
                            selected={selected === method.name}
                            onClick={()=>setSelected(method.name)}
                        />
                    ))
                }
            </div>
        </section>
    )
}