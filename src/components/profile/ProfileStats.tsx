

export default function ProfileStats() {
    return (
        <section className="
            px-5
            grid
            grid-cols-2
            gap-4
            mb-6
        ">
            <StatCard 
                number="12"
                title="Orders"
            />
            <StatCard 
                number="24"
                title="Wishlist"
            />
        </section>
    )
}

function StatCard({
    number, 
    title,
}: {
    number: string,
    title: string
}){
    return (
        <div className="
            bg-surface
            rounded-xl
            p-5
            shadow-sm
            flex
            flex-col
            items-center
        ">
            <span className="
                text-2xl
                font-display
                text-primary
            ">
                {number}
            </span>

            <span className="
                text-sm
                text-on-surface-variant
            ">
                {title}
            </span>
        </div>
    )
}