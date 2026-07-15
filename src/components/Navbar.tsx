import { Menu, Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
    return (
        <header className="flex justify-between items-center h-16 px-4 bg-white shadow-sm">

            <div className="flex items-center gap-3">
                <button className="md:hidden">
                    <Menu size={24} />
                </button>

                <h1 className="text-x1 font-bold text-pink-700">
                    Boutique
                </h1>

                <nav className="hidden md:flex gap-6 ml-8">
                    <a>Products</a>
                    <a>Categories</a>
                    <a>About</a>
                </nav>
            </div>
            

            <div className="flex items-center gap-3">
                <button>
                    <Search size={22} />
                </button>

                <button>
                    <ShoppingBag size={24} />
                </button>
            </div>

        </header>
    );
}