import { Truck} from "lucide-react";

export default function SuccessAction() {
    return (
        <div className="
            flex
            flex-col
            gap-3
        ">
            <button className="
                w-full
                bg-primary
                text-white
                py-4
                rounded-full
                font-semibold
                flex
                justify-center
                items-center
                gap-2
            ">
                <Truck size={20} />
                Track Order
            </button>

            <button className="
                w-full
                bg-surface
                border
                border-primary
                text-primary
                py-4
                rounded-full
                font-semibold
            ">
                Continue Shoppping
            </button>
        </div>
    )
}