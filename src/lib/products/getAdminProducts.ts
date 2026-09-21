import { getAdminStoreId, type StoreMembershipRole } from "./adminStore";
import { toAdminProduct } from "./adminProduct";
import { createClient } from "@/lib/supabase/server";

export async function getAdminProducts() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("Could not verify the current user.");
  }

  if (!user) {
    return [];
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .order("created_at", { ascending: true });

  if (membershipError) {
    throw new Error("Could not load store access.");
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return [];
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      id,
      sku,
      name,
      description,
      category,
      price,
      stock,
      low_stock_threshold,
      status,
      is_new,
      product_images (
        storage_path,
        is_primary
      )
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (productsError) {
    throw new Error("Could not load products.");
  }

  return (products ?? []).map(toAdminProduct);
}