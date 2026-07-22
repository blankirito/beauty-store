import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterForm from "@/components/register/RegisterForm";
import RegisterTerm from "@/components/register/RegisterTerm";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <main className="
            min-h-screen
            bg-background
            px-5
            flex
            flex-col
            items-center
        ">
            <div className="
                w-full
                max-w-md
                flex
                flex-col
                items
            ">
                <RegisterHeader />
                <RegisterForm />

                <div className="
                    flex
                    justify-center
                    items-center
                    mt-6
                    gap-1
                ">
                    <span className="
                        text-on-surface-variant
                    ">
                        Already have an account?
                    </span>

                    <Link 
                        href="/login"
                        className="
                            text-primary
                            font-semibold
                            hover:underline
                        "
                    >
                        Login
                    </Link>
                </div>
            </div>
            <RegisterTerm />
        </main>
    )
}