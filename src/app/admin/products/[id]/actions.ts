"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { prepareProductArchive } from "@/lib/products/productArchive";
import { createClient } from "@/lib/supabase/server";

type ArchiveProductResult =
  | { error: string }
  | { productId: string };

export async function archiveProduct(
  productId: string,
): Promise<ArchiveProductResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your session has ended. Please log in again.",
    };
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .order("created_at", { ascending: true });

  if (membershipError) {
    return {
      error: "We could not confirm your store access.",
    };
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return {
      error: "You do not have permission to archive products in a store.",
    };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .update(prepareProductArchive())
    .eq("id", productId)
    .eq("store_id", storeId)
    .select("id")
    .maybeSingle();

  if (productError) {
    return {
      error: "We could not archive this product. Please try again.",
    };
  }

  if (!product) {
    return {
      error: "Product not found or you do not have permission to archive it.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);

  return {
    productId: product.id,
  };
}