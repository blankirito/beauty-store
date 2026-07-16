

export default function BottomNavigation() {
    return (
        <nav 
            className="
                fixed
                bottom-0
                left-0
                w-full
                bg-white
                shadow-[0_-2px_10px_rgba(0, 0, 0, 0.08)]
                flex
                justify-around
                items-center
                py-3
            ">
                <button className="flex flex-col items-center text-pink-600">
                    <span>🏠</span>
                    <span className="text-xs">Home</span>
                </button>

                <button className="flex flex-col items-center text-gray-700">
                    <span>🛍️</span>
                    <span className="text-xs">Cart</span>
                </button>

                <button className="flex flex-col itesm-center text-gray-700">
                    <span>📦</span>
                    <span className="text-xs">Orders</span>
                </button>

                <button className="flex flex-col items-center text-gray-700">
                    <span>👤</span>
                    <span className="text-xs">Profile</span>
                </button>
            </nav>
    );
}