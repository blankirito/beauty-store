import Link from "next/link";

export default function PromoCarousel() {
    return (
        <section className="px-4 mt-6">
            <Link
                href="/collection/new-arrivals"
                className="
                    block
                    group
                "
            >
                <div className="
                    h-64
                    rounded-xl
                    bg-cover
                    bg-center
                    relative
                    overflow-hidden
                "
                style={{
                    backgroundImage:
                    "url('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908')",
                }}
                >

                    <div className="
                        absolute 
                        inset-0 
                        bg-gradient-to-r
                        from-black/50
                        via-black/20
                        to-transparent
                    ">
                    </div>

                    <div className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        justify-center
                        px-8
                        text-white
                    ">
                        <span className="
                            text-xs 
                            tracking-[0.2em]
                            font-semibold
                            bg-white/20
                            backdrop-blur-sm
                            px-3
                            py-1
                            rounded-full
                            w-fit
                        ">
                            NEW ARRIVALS
                        </span>

                        <h2 className="
                            text-4xl
                            font-display
                            font-medium 
                            mt-3
                        ">
                            The Serene Collection
                        </h2>

                        <p className="
                            text-sm
                            mt-2
                            text-white/80
                            max-w-xs
                        ">
                            Discover timeless skincare essentials crafted for your daily ritual.
                        </p>

                        <span
                            className="
                                mt-5
                                bg-surface
                                text-foreground
                                px-6
                                py-3
                                rounded-lg
                                w-fit
                                text-sm
                                font-semibold
                                transition
                                duration-300
                                hover:bg-primary
                                hover:text-on-primary
                            "
                        >
                            Shop Now    
                        </span>     
                    </div>                   
                </div>
            </Link>
        </section>
    );
}