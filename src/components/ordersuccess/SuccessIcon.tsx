import { Check, CircleCheck } from "lucide-react";

export default function SuccessIcon() {
    return (
        <div className="
            w-32
            h-32
            md:w-40
            md:h-40
            rounded-full
            bg-primary-fixed
            flex
            items-center
            justify-center
            mx-auto
        ">
            <CircleCheck
                size={80}
                className="text-on-primary-fixed"
            />
        </div>
    )
}