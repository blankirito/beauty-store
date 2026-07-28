import SettingsItem from "./SetingsItem";
import type { LucideIcon } from "lucide-react";

export interface SettingsItemData {
    title: string;
    description: string;
    icon: LucideIcon;
    type: "link";
    href?: string;
}

export interface SettingsSectionData {
    title: string;
    icon: LucideIcon;
    color: Color;
    items: readonly SettingsItemData[];
}

export type Color =
    | "primary"
    | "secondary"
    | "tertiary"
    | "error";

interface Props {
    section: SettingsSectionData;
}



export default function SettingsSection({
    section
}: Props) {


    const SectionIcon = section.icon;


    return (

        <div
            className="
                space-y-6
            "
        >


            {/* Section Header */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <SectionIcon
                    size={28}
                    className="text-primary"
                />


                <h3
                    className="
                        text-2xl
                        font-display
                        text-primary
                    "
                >

                    {section.title}

                </h3>


            </div>




            {/* Items Card */}

            <div
                className="
                    bg-surface-container-lowest
                    rounded-xl
                    overflow-hidden
                    border
                    border-outline/20
                "
            >


                {
                    section.items.map((item) => (


                        <SettingsItem

                            key={item.title}

                            item={item}

                            color={section.color}

                        />


                    ))
                }



            </div>


        </div>

    )

}