import Navbar2 from "@/components/shared/Navbar2";
import AccountHeader from "@/components/setting/Account/AccountHeader";
import AccountForm from "@/components/setting/Account/AccountForm";

export default function AccountPage() {
    return (
        <main className="pb-24">
            <Navbar2 />
            <AccountHeader />
            <section className="
                pt-10
                px-4
                md:px-16
                max-w-[600px]
                mx-auto
            ">
                <AccountForm />
            </section>
        </main>
    )
}