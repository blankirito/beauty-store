import { Check, Truck } from "lucide-react";
import TrackingCard from "./TrackingCard";


interface Step{
    title:string;
    date:string;
    status:"completed"|"current"|"pending";

    courier?:string;
    tracking?:string;
    description?:string;
}

interface Props{
    steps: readonly Step[];
}

export default function OrderTimeLine({
    steps
}:Props) {
    return (
        <div className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            shadow-sm
        ">
            <div
                className="
                    relative
                    pl-8
                    border-l-2
                    border-surface-container-highest
                    space-y-10
                "
            >
                {
                    steps.map((step)=>(
                        <div 
                            key={step.title}
                            className="relative"
                        >
                            <div className={`
                                absolute
                                -top-1
                                -left-11
                                w-6
                                h-6
                                rounded-full
                                flex
                                items-center
                                justify-center
                                ${
                                    step.status==="current"
                                    ?
                                    "bg-primary text-white shadow-md"
                                    :
                                    step.status==="completed"
                                    ?
                                    "bg-primary-container text-primary"
                                    :
                                    "bg-surface-container-highest"
                                }
                            `}
                            >
                            
                            {
                                step.status==="current"
                                ?
                                <Truck size={16} />
                                :
                                step.status==="completed"
                                ?
                                <Check size={14} />
                                : 
                                null
                            }
                            </div>

                            <div>
                                <h4 className={`
                                    font-medium
                                    ${
                                        step.status==="current"
                                        ?
                                        "text-primary"
                                        :
                                        "text-on-surface"
                                    }
                                `}>
                                    {step.title}
                                </h4>

                                <p className="
                                    text-sm
                                    text-on-surface-variant
                                    mt-1
                                ">
                                    {step.date}
                                </p>

                                {
                                    step.status==="current"
                                    &&
                                    step.courier
                                    &&
                                    (
                                        <TrackingCard

                                        courier={step.courier}
                                        tracking={step.tracking!}
                                        description={step.description!}

                                        />
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}