"use client";

import { useState } from "react";
import FQAItem from "./FAQItem";
import { faqs } from "@/types/faqData";

export default function FAQSection() {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="
            space-y-1
        ">
            <div className="
                flex
                justify-between
                items-center
                mb-8
            ">
                <h2 className="
                    text-3xl
                    font-display
                    text-primary
                ">Common Questions</h2>
                
                {/* <button className="
                    text-primary
                ">
                    View All FAQs
                </button> */}
            </div>

            {
                faqs.map((faq, index) => (
                    <FQAItem
                        key={faq.question}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={
                            activeIndex === index
                        }
                        onClick={()=>
                            setActiveIndex(
                                activeIndex === index
                                ?
                                null
                                :
                                index
                            )
                        }
                    />
                ))
            }
            <div className="
                flex
                justify-center
                mt-6
            ">
                <button className="
                    text-primary
                    hover:underline
                ">
                    View All FAQs
                </button>
            </div>

        </section>
    )
}