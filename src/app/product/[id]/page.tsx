import ProductNavbar from "@/components/product/ProductNavbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import QuantitySelector from "@/components/product/QuantitySelector";
import ProductDescription from "@/components/product/ProductDescription";
import ReviewSection from "@/components/product/ReviewSection";
import BottomActionBar from "@/components/product/BottomActionBar";

export default function ProductDetailPage() {

	return (
		<main className="pb-24">
			<ProductNavbar />
			<ProductGallery />
			<ProductInfo />
			<QuantitySelector />
			<ProductDescription />
			<ReviewSection />
			{/* <BottomActionBar /> */}
		</main>
	)
}