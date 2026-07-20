import { Menu, Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
    return (
        <header className="flex justify-between items-center h-16 px-6 bg-surface shadow-sm">

            <div className="flex items-center gap-3">
                <button className="
                    md:hidden
                    p-2
                    rounded-full
                    text-on-surface-variant
                    hover:bg-surface-low    
                ">
                    <Menu size={24} />
                </button>

                <h1 className="text-xl font-display font-medium text-primary">
                    Boutique
                </h1>

                <nav className="hidden md:flex gap-6 ml-8">

                    <a className="
                        text-on-surface-variant
                        text-sm
                        hover:text-primary
                    ">Products</a>

                    <a className="
                        text-on-surface-variant
                        text-sm
                        hover:text-primary
                    ">Categories</a>

                    <a className="
                        text-on-surface-variant
                        text-sm
                        hover:text-primary
                    ">About</a>

                </nav>
            </div>
            

            <div className="flex items-center gap-3">
                <button className="
                    p-2
                    rounded-full
                    text-on-surface-variant
                    hover:bg-surface-low    
                ">
                    <Search size={22} />
                </button>

                <button className="
                    p-2
                    rounded-full
                    text-on-surface-variant
                    hover:bg-surface-low    
                ">
                    <ShoppingBag size={24} />
                </button>
            </div>

        </header>
    );
}