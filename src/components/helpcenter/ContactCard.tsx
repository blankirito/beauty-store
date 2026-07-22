import {
    Mail, 
    MessageCircle,
} from "lucide-react";

export default function ContactCard(){
    return (
        <div className="
            bg-surface-low
            border
            border-outline/20
            rounded-2xl
            p-10
            flex
            flex-col
            justify-center
        ">
            <h3 className="
                text-2xl
                font-display
                text-primary
                text-center
                mb-8
            ">Contact Our Concierge</h3>

            <div className="
                space-y-4
            ">
                <button className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-3
                    py-4
                    bg-primary
                    text-white
                    rounded-full
                    hover:opacity-90
                    transition
                ">
                    <Mail size={20}/>
                    Email Support
                </button>

                <button className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-3
                    py-4
                    bg-white
                    text-primary
                    border
                    border-outline/30
                    rounded-full
                    hover:bg-primary-container/20
                    transition
                ">
                    <MessageCircle size={20}/>
                    Live Chat
                </button>
            </div>

            <p className="
                text-center
                text-sm
                text-on-surface-variant
                mt-8
                italic
            ">
                Response time: Typically within 24 hours
            </p>
        </div>
    )
}