import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
    icon: LucideIcon;
}

export default function CategoryCard({
    title, 
    description,
    icon: Icon,
}: Props) {
    return (
        <button className="
            bg-surface-container-lowest
            rounded-xl
            border
            border-outline/20
            p-6
            flex
            flex-col
            items-center
            text-center
            hover:shadow-lg
            transition
        ">
            <div className="
                w-16
                h-16
                rounded-full
                bg-secondary-container
                flex
                items-center
                justify-center
                mb-5
            ">
                <Icon 
                    size={30}
                    className="text-secondary"
                />
            </div>

            <h3 className="
                font-display
                text-xl
                text-primary
            ">
                {title}
            </h3>

            <p className="
                text-sm
                text-outline
                mt-2
            ">
                {description}
            </p>
        </button>
    )
}