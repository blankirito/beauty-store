import ContactCard from "./ContactCard"

export default function ContactSection() {
    return (
        <section className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            mb-20
        ">
            {/* left */}
            <div className="
                min-h-[350px]
                rounded-2xl
                bg-primary
                flex
                items-center
                p-10
                text-white
            ">
                <div>
                    <h2 className="
                        text-4xl
                        font-display
                        mb-4
                    ">Still need help?</h2>

                    <p className="
                        text-white/80
                        max-w-sm
                    ">
                        Our skincare experts are available to guide you through your personalized routine.
                    </p>
                </div>
            </div>

            {/* right */}
            <ContactCard />
        </section>
    )
}