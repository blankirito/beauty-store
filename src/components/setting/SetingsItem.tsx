import {
    ChevronRight
} from "lucide-react";
import type { SettingsItemData, Color } from "./SettingsSection";
import Link from "next/link";

interface Props {
    item: SettingsItemData;
    color: Color;
}


const iconBackground: Record<Color, string> = {

    primary:
        "bg-primary-container/20 text-primary",

    secondary:
        "bg-secondary-container/30 text-secondary",

    tertiary:
        "bg-tertiary-fixed text-tertiary",

    error:
        "bg-error-container/30 text-error"

};



export default function SettingsItem({
    item,
    color
}: Props) {


    const Icon = item.icon;


    return (

        <Link
            href={item.href ?? "#"}
            className="
                w-full
                flex
                items-center
                justify-between
                p-6
                hover:bg-surface-low
                transition
                border-b
                border-outline/20
                text-left
            "

        >


            {/* Left Content */}

            <div
                className="
                    flex
                    items-center
                    gap-5
                "
            >


                {/* Icon Container */}

                <div

                    className={`
                        w-12
                        h-12
                        rounded-full
                        flex
                        items-center
                        justify-center
                        ${iconBackground[color]}
                    `}

                >

                    <Icon
                        size={22}
                    />

                </div>




                {/* Text */}

                <div>


                    <p
                        className="
                            font-medium
                            text-on-surface
                        "
                    >

                        {item.title}

                    </p>



                    <p
                        className="
                            text-sm
                            text-on-surface-variant
                            mt-1
                        "
                    >

                        {item.description}

                    </p>


                </div>


            </div>




            {/* Right Icon */}

            {
                item.type === "link" && (

                    <ChevronRight

                        size={20}

                        className="
                            text-outline
                        "

                    />

                )
            }



        </Link>

    );

}