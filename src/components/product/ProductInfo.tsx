
type ProductInfoProps = {
    name: string;
    price: number;
};

export default function ProductInfo({
    name,
    price,
}: ProductInfoProps) {
    return (
        <section className="
            px-5
            mt-6
        ">
            <div className="
                flex
                justify-between
                items-start
                gap-4
            ">

                {/* Left content */}
                <div className="flex-1">
                    <h1 className="
                        text-3xl
                        font-display
                        font-medium
                        text-foreground
                    ">
                        {name}
                    </h1>

                    <div className="
                        flex
                        items-center
                        gap-2
                        mt-2
                    ">
                        <span className="
                            text-sm
                            font-medium
                            text-green-700
                        ">In Stock</span>

                        {/* <span aria-hidden="true" className="text-on-surface-variant/30">•</span>

                        <span className="
                            text-sm
                            text-foreground/60
                        ">
                            {description}    
                        </span>   */}
                    </div>
                </div>

                <div>
                    <p className="
                        text-2xl
                        font-display
                        font-medium
                        text-primary
                    ">
                        RM{price.toFixed(2)}
                    </p>
                </div>
            </div>
        </section>

    );
}