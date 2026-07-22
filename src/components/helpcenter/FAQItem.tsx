"use client";
import { ChevronDown } from "lucide-react";

interface Props {
    question: string,
    answer: string,
    isOpen: boolean,
    onClick:()=>void;
}

export default function FQAItem({
    question,
    answer,
    isOpen,
    onClick,
}: Props) {

    return (
        <div className="
            bg-surface-container-lowest
            rounded-xl
            border
            border-outline/20
            overflow-hidden
        ">
            <button 
                onClick={onClick}
                className="
                    w-full
                    flex
                    justify-between
                    items-center
                    p-6
            ">
                <h3 className="
                    text-primary
                    font-medium
                    text-left
                ">
                    {question}
                </h3>

                <ChevronDown
                    size={20}
                    className={`
                        transition-transform
                        duration-300

                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            {
                isOpen && (
                    <div className="
                        px-6
                        pb-6
                        text-on-surface-variant
                    ">
                        {answer}
                    </div>
                )
            }
        </div>
    )
}