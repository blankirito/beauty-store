import {
    Minus, 
    Plus,
    Trash2,
} from "lucide-react";

type CartItemProps = {
    name: string,
    description: string,
    price: number,
    quantity: number,
    image: string,
};
    

export default function CartItem({ 
    name,
     description, 
     price, 
     quantity, 
     image,
}: CartItemProps) {
    return (
        <div className="
            flex
            items-center
            gap-4
            bg-surface
            p-4
            rounded-xl
            shadow-sm
        ">
            {/* checkbox */}
            <input
                type="checkbox"
                className="
                    w-5
                    h-5
                    accent-primary
                "
            />

            {/* image */}
            <div className="
                relative
                w-24
                h-24
                rounded-lg
                overflow-hidden
                flex-shrink-0
            ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
                
            

            {/* right side */}
            <div className="flex-1 flex flex-col justify-between h-24">
                {/* top */}
                <div className="flex justify-between">
                    <div>
                        <h3 className="
                            font-display
                            text-lg
                            text-primary
                        ">
                            {name}
                        </h3>
                        <p className="
                            text-sm
                            text-on-surface-variant
                        ">
                            {description}
                        </p>
                    </div>

                    <button className="text-primary hover:text-red-500">
                        <Trash2 size={18} />
                    </button>
                </div>

                {/* bottom */}
                <div className="flex justify-between items-end">
                    <div className="
                        flex
                        items-center
                        border
                        border-outline
                        rounded-full
                        px-2
                        py-1
                    ">
                        <button className="p-1">
                            <Minus size={14} />
                        </button>

                        <span className="px-4 font-semibold">
                            {quantity}
                            </span>

                        <button className="p-1">
                            <Plus size={14} />
                        </button>

                    </div>

                    <span className="
                        text-lg
                        font-bold
                        text-primary
                    ">
                        RM{price.toFixed(2)}
                    </span>
                </div>
            </div>              
        </div>
    )
}