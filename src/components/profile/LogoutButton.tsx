import { LogOutIcon } from "lucide-react"

export default function LogOut() {
    return (
        <div className="
            w-full
            px-5
            mt-8
        ">
            <button className="
                w-full
                py-4
                rounded-xl
                text-red-500
                text-lg
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-red-50
                active:scale-[0.97]
                transition
            ">
                <LogOutIcon size={20} />
                Logout
            </button>
        </div>
    )
}