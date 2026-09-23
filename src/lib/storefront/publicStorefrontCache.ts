import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  toStorefront,
  type DatabaseStorefront,
  type Storefront,
} from "./storefront";
import {
  toStorefrontProduct,
  type DatabaseStorefrontProduct,
  type StorefrontProduct,
} from "./storefrontProduct";

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

const loadCachedStorefront = unstable_cache(
  async (storeSlug: string): Promise<Storefront | null> => {
    const { data, error } = await createPublicClient()
      .rpc("get_public_storefront", {
        p_store_slug: storeSlug,
      })
      .maybeSingle();

    if (error) {
      throw new Error("Could not load this storefront.");
    }

    return data ? toStorefront(data as DatabaseStorefront) : null;
  },
  ["public-storefront"],
  { revalidate: 60 },
);

const loadCachedStorefrontProducts = unstable_cache(
  async (storeId: string): Promise<StorefrontProduct[]> => {
    const { data, error } = await createPublicClient()
      .from("products")
      .select(`
        id,
        store_id,
        slug,
        name,
        description,
        category,
        price,
        stock,
        rating,
        review_count,
        is_new,
        product_images (
          storage_path,
          alt_text,
          sort_order,
          is_primary
        )
      `)
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Could not load storefront products.");
    }

    return (data ?? []).map((product) =>
      toStorefrontProduct(product as DatabaseStorefrontProduct),
    );
  },
  ["public-storefront-products"],
  { revalidate: 60 },
);

const loadCachedStorefrontProduct = unstable_cache(
  async (
    storeId: string,
    productSlug: string,
  ): Promise<StorefrontProduct | null> => {
    const { data, error } = await createPublicClient()
      .from("products")
      .select(`
        id,
        store_id,
        slug,
        name,
        description,
        category,
        price,
        stock,
        rating,
        review_count,
        is_new,
        product_images (
          storage_path,
          alt_text,
          sort_order,
          is_primary
        )
      `)
      .eq("store_id", storeId)
      .eq("slug", productSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      throw new Error("Could not load this product.");
    }

    return data
      ? toStorefrontProduct(data as DatabaseStorefrontProduct)
      : null;
  },
  ["public-storefront-product"],
  { revalidate: 60 },
);

export function getCachedPublicStorefront(storeSlug: string) {
  return loadCachedStorefront(storeSlug.trim().toLowerCase());
}

export function getCachedPublicStorefrontProducts(storeId: string) {
  return loadCachedStorefrontProducts(storeId);
}

export function getCachedPublicStorefrontProduct(
  storeId: string,
  productSlug: string,
) {
  return loadCachedStorefrontProduct(storeId, productSlug.trim().toLowerCase());
}
