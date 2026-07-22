import { ShoppingBag  } from "lucide-react";

export default function LoginHeader() {
    return (
        <header className="
            flex
            flex-col
            items-center
            text-center
        ">
            <ShoppingBag 
                size={48}
                fill="currentColor"
                className="
                    text-primary
                    mb-6
                "
            />

            <h1 className="
                text-4xl
                text-on-background
                mb-2
                font-display
            ">
                Welcome Back
            </h1>

            <p className="
                text-on-surface-variant
                max-w-[280px]
            ">
                Log in to your Boutique account to continue shopping.
            </p>
        </header>
    )
}