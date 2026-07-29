import { Plus } from "lucide-react";

export default function AddCardButton() {
    return (
        <button className="
            min-h-[180px]
            rounded-xl
            border-2
            border-dashed
            border-outline
            flex
            flex-col
            items-center
            justify-center
            gap-3
            transition
            hover:bg-surface-low
            group
        ">
            <div className="
                w-12
                h-12
                rounded-full
                bg-surface-container
                flex
                items-center
                justify-center
                text-primary
                transition
                group-hover:bg-primary-container
                grou-hover:text-on-primary-fixed
            ">
                <Plus size={24}/>
            </div>

            <span className="
                text-sm
                font-semibold
                tracking-wide
                text-on-surface-variant
                group-hover:text-primary
                transition
            ">
                Add New Card
            </span>
        </button>
    )
}