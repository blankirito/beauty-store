import Navbar2 from "@/components/shared/Navbar2"
import HelpHeader from "@/components/helpcenter/HelpHeader";
import SearchBar from "@/components/helpcenter/SearchBar";
import CategoryGrid from "@/components/helpcenter/CategoryGrid";
import FAQSection from "@/components/helpcenter/FAQSection";
import ContactSection from "@/components/helpcenter/ContactSection";

export default function HelpCenterPage() {
    return (
        <>
        <Navbar2 />
        <main className="
            min-h-screen
            bg-background
            px-5
            md:px-16
            py-12
        ">
            <div className="
                max-w-[1100px]
                mx-auto
                space-y-10
            ">
                <HelpHeader />
                <SearchBar />
                <CategoryGrid />
                <FAQSection />
                <ContactSection />
            </div>
        </main>
        </>
        
    )
}