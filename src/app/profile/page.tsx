import Navbar from "@/components/shared/Navbar";
import BottomNavigation from "@/components/shared/BottomNavigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileMenu from "@/components/profile/ProfileMenu";
import LogOut from "@/components/profile/LogoutButton";

export default function ProfilePage() {
    return (
        <main className="pb-24">
            <Navbar />
            <ProfileHeader />
            <ProfileStats />
            <ProfileMenu />
            <LogOut />
            <BottomNavigation />
        </main>
    )
}