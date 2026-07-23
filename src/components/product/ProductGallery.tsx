import Image from "next/image";

type ProductGalleryProps = {
    images: string[];
}

export default function ProductGallery({
    images,
}: ProductGalleryProps) {
    return (
        <section className="
            relative
            w-full
            aspect-square
            overflow-hidden
            bg-surface-low
        ">
            <Image
                src={images[0]}
                alt="Product image"
                fill
                className="
                    object-cover
                "
            />

            {/* Image Indicator*/}
            <div className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                flex
                gap-2
            ">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`
                            h-2
                            rounded-full
                            transition-all
                            ${index === 0 ? "w-5 bg-primary" : "w-2 bg-primary/30"}
                        `}
                     />
                ))}
            </div>
        </section>
    );
}