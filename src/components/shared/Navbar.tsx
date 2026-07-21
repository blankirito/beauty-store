import { Menu, Search } from "lucide-react";

export default function Navbar() {
    return (
        <header 
            className="
                sticky
                top-0
                z-50
                h-16
                px-5
                bg-background
                flex
                items-center
                justify-between    
            ">
                <div className="flex items-center gap-4">
                    <button className="text-primary">
                        <Menu size={24} />
                    </button>

                    <h1 className="
                        text-2xl
                        font-display
                        font-medium
                        text-primary
                    ">
                        Boutique
                    </h1>
                </div>

                <button className="text-primary">
                    <Search size={24} />
                </button>
            </header>
    )
}