import Navbar2 from "@/components/shared/Navbar2"
import CollectionHeader from "@/components/collection/CollectionHeader";
import CollectionProductGrid from "@/components/collection/CollectionProductGrid";

import { products } from "@/data/products";

export default function NewArrivalPage() {

    const newProducts = products.filter(
        product => product.isNew
    );

    return(
        <main className="pb-24">
            <Navbar2 />
            <CollectionHeader />
            <CollectionProductGrid
                products={newProducts}
            />
            
        </main>
    )
}