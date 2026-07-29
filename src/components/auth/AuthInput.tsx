"use client";
import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
    label: string;
    placeholder: string;
    icon?: LucideIcon;
    type?: string;
    value?: string;
    onChange?: (
        e:React.ChangeEvent<HTMLInputElement>)=>void;
    autoComplete?: string;
}

export default function AuthInput({
    label,
    placeholder,
    icon:Icon,
    type="text",
    value,
    onChange,
    autoComplete,
}: Props) {

    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type
    return (
        <div className="
            flex
            flex-col
            gap-2
        ">
            <label className="
                text-sm
                font-semibold
                tracking-wide
                text-on-surface-variant
                ml-1
            ">
                {label}
            </label>

            <div className="
                group
                flex
                items-center
                bg-surface-low
                rounded-xl
                border-2
                border-transparent
                transition
                focus-within:border-primary
                focus-within:bg-white
                overflow-hidden
            ">
                {
                    Icon && (
                        <Icon 
                            size={20}
                            className="
                                ml-4
                                text-outline
                                group-focus-within:text-primary
                            "
                        />
                    )
                }
                

                <input 
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="
                        flex-1
                        bg-transparent
                        border-none
                        outline-none
                        px-4
                        py-4
                        text-on-surface
                        placeholder:text-outline
                        focus:ring-0
                    "
                />
                {
                    type === "password" && (
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="
                                mr-4
                                text-outline
                                hover:text-primary
                                transition
                            "
                        >
                            {
                                showPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                            }
                        </button>
                    )
                }
            </div>
        </div>
    )
}