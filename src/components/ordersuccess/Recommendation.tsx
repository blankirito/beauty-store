const products=[
    {
        name:"Premium Leather Tote",
        price:"RM185",
        image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883"
    },
    {
        name:"Minimalist Pendant",
        price:"RM95",
        image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    }
]


export default function Recommendation(){

    return (
        <div>
            <h2
                className="
                    text-lg
                    font-display
                    mb-4
                "
            >
                You might also like...
            </h2>

            <div
                className="
                    grid
                    grid-cols-2
                    gap-4
                "
            >
                {
                    products.map(product=>(
                        <div key={product.name}>

                            <img
                                src={product.image}
                                alt={product.name}
                                className="
                                    aspect-square
                                    rounded-xl
                                    object-cover
                                "
                            />

                            <p className="
                                mt-2
                                truncate
                            ">
                                {product.name}
                            </p>

                            <p
                                className="
                                    text-primary
                                    font-semibold
                                "
                            >
                                {product.price}
                            </p>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}