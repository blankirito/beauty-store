import { Info } from "lucide-react";

export default function PasswordRequirement() {
    return (
        <div className="
            bg-surface-container-low
            p-4
            rounded-lg
            border
            border-outline-variant/20
        ">
            <p className="
                text-sm
                font-semibold
                text-on-surface-variant
                mb-2
                flex
                items-center
            ">
                <span className="
                    material-symbols-outlined
                    mr-1
                    text-primary-container
                ">
                    <Info size={16} />
                </span>
                Password Requirements:
            </p>

            <ul className="
                text-[13px]
                text-on-surface-variant
                space-y-1
                pl-6
                list-disc
            ">
                <li>Minimum of 8 characters</li>
                <li>Include at least one symbol (!@#$%^&*)</li>
                <li>Include at least one number</li>
            </ul>
        </div>
    )
}