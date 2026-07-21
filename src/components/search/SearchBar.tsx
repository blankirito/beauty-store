import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="
            relative
            px-5
            mt-6
        ">
            <Search 
                size={20}
                className="
                    absolute
                    left-9
                    top-1/2
                    -translate-y-1/2
                    text-outline
                "
            />

            <input
                placeholder="Search Products..."
                className="
                    w-full
                    h-14
                    pl-12
                    pr-4
                    rounded-full
                    bg-surface-low
                    outline-none
                    focus:ring-2
                    focus:ring-primary-container
                "
            />
        </div>
    )
}