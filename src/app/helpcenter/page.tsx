import Navbar2 from "@/components/shared/Navbar2";
import HelpCenterClient from "@/components/helpcenter/HelpCenterClient";

export default function HelpCenterPage() {
  return (
    <>
      <Navbar2 />

      <main className="min-h-screen bg-background px-5 py-12 md:px-16">
        <HelpCenterClient />
      </main>
    </>
  );
}