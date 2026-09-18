import Navbar2 from "@/components/shared/Navbar2";
import CategoryClient from "@/components/category/CategoryClient";
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

function toSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export default async function CategoryProductPage({ params }: Props) {
  const { category } = await params;

  const categoryProducts = products.filter(
    (product) => toSlug(product.category) === category.toLowerCase(),
  );

  const displayCategory = category
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="pb-24">
      <Navbar2 />

      <CategoryClient
        category={displayCategory}
        products={categoryProducts}
      />
    </main>
  );
}