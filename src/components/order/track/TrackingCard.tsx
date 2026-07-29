import { Package } from "lucide-react";

interface Props {
    courier: string;
    tracking: string;
    description: string;
}

export default function TrackingCard({
    courier,
    tracking,
    description
}:Props) {
    return (
        <div className="
            bg-surface-container
            rounded-lg
            p-4
            border-lowest
            border-outline-variant/30
            mt-4
        ">
            <div className="
                flex
                items-center
                gap-3
                mb-3
            ">
                <div className="
                    w-10
                    h-10
                    rounded-full
                    bg-surface-container-high
                    flex
                    items-center
                    justify-center
                ">
                    <Package 
                        size={20}
                        className="text-outline"
                    />
                </div>

                <div>
                    <p className="
                        font-medium
                        text-on-surface
                    ">
                        {courier}
                    </p>

                    <p className="
                        text-xs
                        text-on-surface-variant
                    ">
                        Tracking: {tracking}
                    </p>
                </div>
            </div>

            <div className="
                border-t
                border-surface-container-highest
                pt-3
                text-sm
                text-on-surface-variant
            ">
                {description}
            </div>
        </div>
    )
}