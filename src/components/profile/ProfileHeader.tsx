import { Pencil, Star } from "lucide-react";

export default function ProfileHeader() {
    return (
        <section className="
            px-5
            pt-8
            pb-10
            flex
            flex-col
            items-center
            text-center
        ">
            <div className="
                relative
                mb-4
            ">
                <div className="
                    w-24
                    h-24
                    rounded-full
                    overflow-hidden
                    border-2
                    border-primary-fixed
                ">
                    <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                        alt="profile"
                        className="
                            w-full
                            h-full
                            object-cover
                        "
                    />
                </div>
                <button className="
                    absolute
                    bottom-0
                    right-0
                    bg-primary
                    text-white
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                ">
                    <Pencil size={16} />
                </button>
            </div>

            <h1 className="
                text-3xl
                font-display
                text-foreground
            ">Alex Morgan</h1>

            <div className="
                mt-4
                px-4
                py-2
                rounded-full
                bg-secondary-container
                text-on-secondary-container
                flex
                items-center
                gap-1
                text-sm
                font-semibold
            ">
                <Star size={15} fill="currentColor" />
                Premium Member
            </div>
        </section>
    )
}