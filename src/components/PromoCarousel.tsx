

export default function PromoCarousel() {
    return (
        <section className="px-4">
            <div className="
                h-52 
                rounded-2x1 
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
                    from-black/60
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
                        tracking-widest 
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
                        text-3xl 
                        font-semibold 
                        mt-2
                    ">
                        The Serene Collection
                    </h2>

                    <button className="
                        mt-4
                        bg-white
                        text-black
                        px-5
                        py-2
                        rounded-full
                        w-fit
                        shadow-md
                        hover:bg-gray-100
                        transition
                    ">
                        Shop Now
                    </button>
                </div>
            </div>
        </section>
    );
}