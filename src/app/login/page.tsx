import LoginHeader from "@/components/login/LoginHeader";
import LoginForm from "@/components/login/LoginForm";
import SocialLogin from "@/components/login/SocialLogin";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="
            min-h-screen
            bg-background
            flex
            items-center
            justify-center
            px-5
        ">
            <div className="
                w-full
                max-w-md
                flex
                flex-col
                gap-8
            ">
                <LoginHeader />

                <section className="
                    bg-surface-container-lowest
                    rounded-xl
                    p-6
                    shadow-[0px_4px_12px_rgba(132, 81, 69, 0.08)]
                ">
                    <LoginForm />

                    <div className="
                        flex
                        items-center
                        my-6
                    ">
                        <div className="
                            flex-1
                            h-px
                            bg-outline/50
                        "/>

                        <span className="
                            px-4
                            text-sm
                            text-outline
                        ">OR</span>

                        <div className="
                            flex-1
                            h-px
                            bg-outline/50
                        "/>
                    </div>

                    <SocialLogin />
                </section>

                <p className="
                    text-center
                    text-on-surface-variant
                ">
                    Don&apos;t have an account?

                    <Link 
                        href="/register"
                        className="
                            ml-1
                            text-primary
                            font-semibold
                            hover:underline
                        "
                    >
                        Register
                    </Link>
                </p>
            </div>
        </main>
    )
}