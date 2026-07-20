import {
    CircleCheck
} from "lucide-react";

export default function ProductDescription() {
    return (
        <section className="px-5 mt-8">
            <h2 className="
                text-2xl
                font-display
                font-medium
                text-foreground
                mb-3
            ">Product Description</h2>

            <p className="
                text-sm
                text-on-surface-variant
                leading-relaxed
            ">
                Elevate your daily skincare routine with our premium collection. Carefully crafted with high quality ingredients to provide hydration and nourishment for you skin.
            </p>

            <ul className="
                mt-5
                space-y-3
                text-sm
                text-on-surface-variant
            ">
                <li className="
                    flex
                    items-center
                    gap-2
                ">
                    <span className="
                        text-primary
                        text-lg
                    ">
                        <CircleCheck size={14} className="text-primary" />
                    </span>
                    Premium quality ingredients
                </li>

                <li className="
                    flex
                    items-center
                    gap-2
                ">
                    <span className="
                        text-primary
                        text-lg
                    ">
                        <CircleCheck size={14} className="text-primary" />
                    </span>
                Suitable for daily use
                </li>

                <li className="
                    flex
                    items-center
                    gap-2
                ">
                    <span className="
                        text-primary
                        text-lg
                    ">
                        <CircleCheck size={14} className="text-primary" />
                    </span>
                Dermatologically tested
                </li>
            </ul>
        </section>
    );
}