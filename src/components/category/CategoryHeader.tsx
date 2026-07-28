

type Props = {
    category: string;
    count: number;
}

export default function CategoryHeader({
    category,
    count,
}: Props) {
    return(
        <section className="
            px-5
            pt-8
            pb-6
            text-center
        ">
            <h1 className="
                text-4xl
                font-display
                text-primary
            ">
                {category}
            </h1>

            <span className="
                inline-block
                mt-4
                px-4
                py-2
                rounded-full
                bg-surface-low
                text-sm
            ">
                {count} Products
            </span>
        </section>
    )
}