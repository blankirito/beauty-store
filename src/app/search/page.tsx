import Navbar from "@/components/shared/Navbar";
import SearchBar from "@/components/search/SearchBar";
import RecentSearch from "@/components/search/RecentSearch";
import PopularCategory from "@/components/search/PopularCategory";
import SearchProductGrid from "@/components/search/SearchProductGrid";
import FilterBar from "@/components/search/FilterBar";

export default function SearchPage() {
    return(
        <main className="pb-10">
            <Navbar />
            <SearchBar />
            <RecentSearch />
            <PopularCategory />
        </main>
    )
}