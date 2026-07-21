import {
    X, 
    Star
} from "lucide-react";

type WishListItem = {
    id: number, 
    name: string,
    price: number,
    image: string,
    description: string,
}

export default function WishListCard({
    name, 
    price,
    image,
    description,
}:WishListItem) {
    return (
        <div className="
            bg-surface
            rounded-xl
            overflow-hidden
            shadow-sm
            border
            border-outline
        ">

            {/* image */}
            <div className="
                relative
                aspect-[4/5]
            ">
                <img
                    src={image}
                    alt={name}
                    className="
                        w-full
                        h-full
                        object-cover
                    "
                />

                <button className="
                    absolute
                    top-3
                    right-3
                    w-9
                    h-9
                    rounded-full
                    bg-white/80
                    flex
                    items-center
                    justify-center
                    text-primary
                ">
                    <X size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="
                p-5
            ">
                <div className="
                    flex
                    justify-between
                    items-start
                ">
                    <h2 className="
                        text-lg
                        justify-between
                        text-primary
                    ">{name}</h2>

                    <span className="
                        text-primary
                        font-semibold
                    ">RM{price}</span>
                </div>

                <p className="
                    mt-2
                    text-sm
                    text-on-surface-variant
                    line-clamp-2
                ">{description}</p>

                {/* rating */}
                <div className="
                    flex
                    items-center
                    gap-1
                    mt-4
                ">
                    {
                        Array.from({length:5}).map((_, i)=>(
                            <Star   
                                key={i}
                                size={15} fill="currentColor" className="text-primary"
                            />
                        ))
                    }
                </div>

                <button className="
                    mt-6
                    w-full
                    py-3
                    rounded-full
                    bg-primary
                    text-white
                    font-semibold
                ">ADD TO CART</button>
            </div>

        </div>
    )
}