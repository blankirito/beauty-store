import Navbar from "@/components/shared/Navbar";
import PasswordHeader from "@/components/setting/Password/PasswordHeader";
import PasswordForm from "@/components/setting/Password/PasswordForm";

export default function PasswordPage() {
    return (
        <main className="pb-24 ">
            <Navbar />
            <PasswordHeader />
            <section
                className="
                    pt-10
                    px-4
                "
            >
                <div
                    className="
                        bg-surface-container-lowest
                        rounded-xl
                        p-8
                        shadow-sm
                    "
                >
                    <PasswordForm />
                </div>
            </section>
        </main>
    )
}