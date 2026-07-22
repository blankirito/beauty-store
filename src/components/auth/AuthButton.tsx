
interface Props {
    children: React.ReactNode;
    loading?: boolean;
    loadingtext?: string;
    onClick?: () => void;
    type?: "button" | "submit";
}

export default function AuthButton({
    children,
    loading = false,
    loadingtext,
    onClick,
    type = "button"
}: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className="
                w-full
                h-14
                rounded-xl
                bg-primary
                text-white
                font-semibold
                transition
                hover:opacity-90
                disabled:opacity-70
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
            "
        >
            {
                loading 
                    ? (
                        <>
                            <div className="
                                w-5
                                h-5
                                border-2
                                border-white
                                border-t-transparent
                                rounded-full
                                animate-spin
                            "/>
                            {loadingtext}
                        </>
                    )
                    : (children)
            }
        </button>
    )
}