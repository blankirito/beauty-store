import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="flex items-center gap-3 px-4 mt-4">
            <div className="flex items-center flex-1 border rounded-1g px-3 py-2">
                <Search size={18}className="text-gray-700" />
                <input type="text" placeholder="Search products..." className="flex-1 m1-2 outline-none" />
            </div>

            <button className="bg-pink-700 text-white p-3 rounded-1g">
                <SlidersHorizontal size={18} />
            </button>
        </div>
    );
}