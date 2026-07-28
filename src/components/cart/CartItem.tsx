import Link from "next/link";
import {
    Minus, 
    Plus,
    Trash2,
} from "lucide-react";

type CartItemProps = {
    id: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    image: string,
};
    

export default function CartItem({ 
    id,
    name,
     description, 
     price, 
     quantity, 
     image,
}: CartItemProps) {
    return (
        <Link 
            href={`/product/${id}`}
            className="
                block
                transition
                duration-150
                active:scale-[0.97]
                active:opacity-70
            ">
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
                    <div className="flex-1 min-w-0 flex flex-col justify-between min-h-28">
                        {/* top */}
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <h3 className="
                                    font-display
                                    text-lg
                                    text-primary
                                    truncate
                                    break-all
                                ">
                                    {name}
                                </h3>
                                <p className="
                                    text-sm
                                    text-on-surface-variant
                                    truncate
                                    break-all
                                ">
                                    {description}
                                </p>
                            </div>

                            <button className="text-outline hover:text-red-500 flex-shrink-0">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* bottom */}
                        <div className="
                            mt-3
                            flex
                            flex-wrap
                            items-end
                            gap-x-3
                            gap-y-5
                        ">
                            <div className="
                                flex
                                w-fit
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
                                whitespace-nowrap
                                flex-shrink-0
                                sm:ml-auto
                            ">
                                RM{price.toFixed(2)}
                            </span>
                        </div>
                    </div>              
                </div>
            </Link>
        
    )
}