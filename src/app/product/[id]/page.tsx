import ProductNavbar from "@/components/product/ProductNavbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDescription from "@/components/product/ProductDescription";
import ReviewSection from "@/components/product/ReviewSection";
import ProductClient from "@/components/product/ProductClient";

import { products } from "@/data/products";

type Props = {
	params: Promise<{
		id: string,
	}>;
}

export default async function ProductDetailPage({
	params,
}: Props) {

	const { id } = await params;
	const product = products.find(
		item => item.id === Number(id)
	);

	if(!product) {
		return (
			<div>
				Product Not Found
			</div>
		)
	}

	return (
		<main className="pb-24">
			<ProductNavbar />
			<ProductGallery 
				images={product.images}
			/>
			<ProductInfo 
				name={product.name}
				price={product.price}
				// rating={product.rating}
			/>
			<ProductClient
				id={product.id}
			/>
			<ProductDescription
				description={product.description}
				features={product.features}
			/>
			<ReviewSection />
		</main>
	)
}