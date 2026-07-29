

export default function SavePreferenceButton() {
    return (
        <div className="
            fixed
            bottom-0
            left-0
            w-full
            z-40
            bg-surface-container-lowest
            border-t
            border-outline/30
            p-5
        ">
            <div className="
                max-w-6xl
                mx-auto
            ">
                <button className="
                    w-full
                    md:w-auto
                    md:px-12
                    py-4
                    rounded-lg
                    bg-primary
                    text-white
                    font-semibold
                    transition
                    hover:opacity-90
                    active:scale-[0.98]
                ">
                    Save Preference
                </button>
            </div>
        </div>
    )
}