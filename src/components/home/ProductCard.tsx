import Link from "next/link";
import { 
    Heart,
    Star
} from "lucide-react";

type ProductCardProps = {
    id: number,
    name: string,
    description: string,
    price: number,
    rating: number,
    image: string,
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    rating,
    image,
}: ProductCardProps) {
    return (
        <Link href={`/product/${id}`} className="w-full">
            <div className="
                bg-surface
                rounded-xl
                overflow-hidden
                shadow-sm
                transition
                duration-300
                hover:shadow-md
            ">

                <div className="
                    relative
                    aspect-square
                    bg-cover
                    bg-center
                    group
                    overflow-hidden
                "
                style={{
                    backgroundImage: `url(${image})`,
                }}
                >
                    <div className="
                        absolute
                        inset-0
                        bg-black/0
                        transition
                        duration-300
                        group-hover:bg-black/10
                    "/>

                    <button className="
                        absolute
                        top-3
                        right-3
                        w-9
                        h-9
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        text-on-surface
                        transition
                        hover:text-primary
                    ">
                        <Heart size={18} />
                    </button>
                </div>

                <div className="p-4">

                    <div className="
                        flex
                        items-center
                        gap-1
                        text-sm
                        text-secondary
                    ">
                        <Star size={14} fill="currentColor"/>
                        <span>{rating}</span>
                    </div>
                
                    <h3 className="
                        mt-1
                        font-display
                        text-lg
                        font-medium
                        text-primary
                    ">
                        {name}
                    </h3>

                    <p className="
                        mt-1
                        text-on-surface-variant
                        text-sm
                    ">
                        {description}
                    </p>

                    <p className="
                        font-semibold
                        mt-3
                        text-lg
                        text-primary
                    ">
                        RM{price}
                    </p>

                </div>
            </div>
        </Link>
        
    );
}