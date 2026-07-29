import { Check, Circle } from "lucide-react";

interface Step {
    title: string;
    date: string;
    status: "completed" | "current" | "pending";
}

interface Props {
    steps: readonly Step[];
}

export default function OrderTimeLine({
    steps
}: Props) {
    return (
        <section className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            md:p-8
            border
            border-secondary/30
        ">
            <h3 className="
                text-sm
                uppercase
                tracking-widest
                font-semibold
                text-on-surface
                pb-4
                mb-6
                border-b
                border-surface-container-highest
            ">Delivery Status</h3>

            <div className="
                relative
                pl-8
                space-y-8
            ">
                <div className="
                    absolute
                    left-0
                    top-3
                    bottom-3
                    w-px
                    border-l-2
                    border-surface-container-highest
                "/>
                {
                    steps.map((step)=>(
                        <div 
                            key={step.title}
                            className="
                                relative
                            "
                        >
                            <div className={`
                                absolute
                                -left-11
                                top-0
                                w-6
                                h-6
                                rounded-full
                                flex
                                items-center
                                justify-center
                                ${
                                    step.status==="current"
                                    ?
                                    "bg-primary-container text-white ring-4 ring-primary-container/30"
                                    :
                                    step.status==="completed"
                                    ?
                                    "bg-primary text-white"
                                    :
                                    "bg-surface-container-highest text-outline"
                                }
                            `}>
                                {
                                    step.status==="completed"
                                    &&
                                    <Check size={14} />
                                }

                                {
                                    step.status==="current"
                                    &&
                                    <Circle 
                                        size={14}
                                        fill="currentColor"
                                        strokeWidth={0}
                                    />
                                }
                            </div>

                            <div>
                                <p className={`
                                    text-sm
                                    font-semibold
                                    ${
                                        step.status==="current"
                                        ?
                                        "text-primary"
                                        :
                                        "text-on-surface"
                                    }
                                `}>
                                    {step.title}
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-on-surface-variant
                                ">
                                    {step.date}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}