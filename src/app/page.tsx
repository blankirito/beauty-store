import Image from "next/image";
import Navbar from "@/components/home/Navbar";
import SearchBar from "@/components/home/SearchBar";
import PromoCarousel from "@/components/home/PromoCarousel";
import CategorySelection from "@/components/home/CategorySelection";
import RecommendedProducts from "@/components/home/RecommendedProduct";
import BottomNavigation from "@/components/shared/BottomNavigation";

export default function Home() {
  return (
    <main className="pb-24">
      <Navbar />
      <SearchBar />
      <PromoCarousel />
      <CategorySelection />
      <RecommendedProducts />
      {/* <BottomNavigation /> */}
      testing
    </main>
  );
}