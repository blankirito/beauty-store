import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="flex items-center gap-3 px-4 mt-4">
            <div className="flex items-center flex-1 bg-surface-low rounded-xl px-4 h-12">
                <Search size={18} className="text-on-surface-variant" />
                <input type="text" placeholder="Search curated collection..." className="flex-1 ml-3 outline-none bg-transparent text-on-surface" />
            </div>

            <button className="bg-primary text-on-primary w-12 h-12 flex items-center justify-center rounded-xl">
                <SlidersHorizontal size={18} />
            </button>
        </div>
    );
}