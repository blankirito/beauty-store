type ProfileStatsProps = {
    orderCount?: number;
    activeOrderCount?: number;
};

export default function ProfileStats({
    orderCount = 12,
    activeOrderCount = 2,
}: ProfileStatsProps) {
    return (
        <section className="
            px-5
            grid
            grid-cols-2
            gap-4
            mb-6
        ">
            <StatCard
                number={String(orderCount)}
                title="Orders"
            />

            <StatCard
                number={String(activeOrderCount)}
                title="Active Orders"
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
}) {
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