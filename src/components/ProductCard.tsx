
type ProductCardProps = {
    name: string,
    description: string,
    price: number,
    rating: number,
    image: string,
}

export default function ProductCard( {
    name,
    description,
    price,
    rating,
    image,
}: ProductCardProps) {
    return (
        <div className="
            bg-white
            rounded-xl
            overflow-hidden
            shadow-sm
        ">

            <div className="
                relative
                aspect-square
                bg-cover
                bg-center
            "
            style={{
                backgroundImage: `url(${image})`,
            }}
            >
                <button className="
                    absolute
                    top-2
                    right-2
                    w-8
                    h-8
                    bg-white/90
                    rounded-full
                ">
                    ❤️
                </button>
            </div>

            <div className="p-3">

                <div className="
                    flex
                    items-center
                    gap-1
                    text-sm
                ">
                    <span>⭐</span>
                    <span>{rating}</span>
                </div>
                
                <h3 className="
                    font-semibold
                ">
                    {name}
                </h3>

                <p className="
                    text-gray-700
                    text-sm
                ">
                    {description}
                </p>

                <p className="
                    font-bold
                    mt-2
                ">
                    RM{price}
                </p>

            </div>
        </div>
    );
}