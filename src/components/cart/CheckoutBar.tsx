import { 
    ArrowRight
} from "lucide-react";

export default function CheckoutBar() {
    return (
        <div className="
            left-0
            w-full
            z-40
            px-5
            py-4
        ">
            <button className="
                w-full
                bg-primary
                text-white
                py-4
                rounded-full
                text-lg
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                active:scale-[0.98]
                transition
            ">
                Proceed to Checkout
                <ArrowRight size={20} />
            </button>
        </div>
    )
}