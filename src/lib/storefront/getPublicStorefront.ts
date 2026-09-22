import { createClient } from "@/lib/supabase/server";
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

export async function getPublicStorefront(
  storeSlug: string,
): Promise<Storefront | null> {
  const normalizedSlug = storeSlug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_public_storefront", {
      p_store_slug: normalizedSlug,
    })
    .maybeSingle();

  if (error) {
    throw new Error("Could not load this storefront.");
  }

  return data ? toStorefront(data as DatabaseStorefront) : null;
}

export async function getPublicStorefrontProducts(
  storeId: string,
): Promise<StorefrontProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
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

  return (data ?? []).map(toStorefrontProduct);
}

export async function getPublicStorefrontProduct(
  storeId: string,
  productSlug: string,
): Promise<StorefrontProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
}

type DatabaseStorefrontPaymentMethod = {
  id: string;
  label: string;
  instructions: string;
};

export type StorefrontPaymentMethod = {
  id: string;
  label: string;
  instructions: string;
};

export async function getPublicStorefrontPaymentMethods(
  storeSlug: string,
): Promise<StorefrontPaymentMethod[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_store_payment_methods",
    {
      p_store_slug: storeSlug.trim().toLowerCase(),
    },
  );

  if (error) {
    throw new Error("Could not load payment methods.");
  }

  return (
    (data ?? []) as DatabaseStorefrontPaymentMethod[]
  ).map((paymentMethod) => ({
    id: paymentMethod.id,
    label: paymentMethod.label,
    instructions: paymentMethod.instructions,
  }));
}