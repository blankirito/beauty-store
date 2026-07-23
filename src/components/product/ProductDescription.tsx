import {
    CircleCheck
} from "lucide-react";

type ProductDescriptionProps = {
    description: string;
    features: string[];
}

export default function ProductDescription({
    description,
    features
}: ProductDescriptionProps) {
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
                {description}
            </p>

            <ul className="
                mt-5
                space-y-3
                text-sm
                text-on-surface-variant
            ">
                {
                    features.map((feature, index)=>(
                        <li
                            key={index}
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <CircleCheck
                                size={16}
                                className="text-primary"
                            />

                            {feature}
                        </li>
                    ))
                }
            </ul>
        </section>
    );
}