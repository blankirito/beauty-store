import Image from "next/image";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PromoCarousel from "../components/PromoCarousel";
import CategorySelection from "../components/CategorySelection";
import RecommendedProducts from "../components/RecommendedProduct";
import BottomNavigation from "../components/BottomNavigation";

export default function Home() {
  return (
    <main>
      <Navbar />
      <SearchBar />
      <PromoCarousel />
      <CategorySelection />
      <RecommendedProducts />
      <BottomNavigation />
    </main>
  );
}