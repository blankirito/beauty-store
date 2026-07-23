import Link from "next/link";

export default function ProductActionBar() {
    return (
        <nav
            className="
                fixed
                bottom-0
                left-0
                w-full
                z-50
                bg-white
                border-t
                border-outline
                px-5
                py-4
                flex
                items-center
                justify-center
                gap-6
                shadow-lg
            "
        >
            <button
                className="
                    flex-1
                    h-14
                    rounded-xl
                    border-[2px]
                    border-primary
                    bg-transparent
                    text-primary
                    font-bold
                    uppercase
                    tracking-wider
                    text-sm
                "
            >
                Add to Cart
            </button>

            <Link
                href="/checkout"
                className="
                    flex-1
                    h-14
                    rounded-xl
                    bg-primary
                    text-white
                    font-bold
                    uppercase
                    tracking-wider
                    text-sm
                    shadow-lg
                    flex
                    items-center
                    justify-center
                "
            >
                Buy Now
            </Link>
            

        </nav>
    );
}