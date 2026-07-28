import Navbar from "@/components/shared/Navbar"
import CollectionHeader from "@/components/collection/CollectionHeader";
import CollectionProductGrid from "@/components/collection/CollectionProductGrid";

import { products } from "@/data/products";

export default function NewArrivalPage() {

    const newProducts = products.filter(
        product => product.isNew
    );

    return(
        <main className="pb-24">
            <Navbar />
            <CollectionHeader />
            <CollectionProductGrid
                products={newProducts}
            />
            
        </main>
    )
}