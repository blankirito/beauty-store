"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import {
  prepareProductUpdate,
} from "@/lib/products/productUpdate";
import type { NewProductFormValues } from "@/lib/products/newProduct";
import { createClient } from "@/lib/supabase/server";

type UpdateProductResult =
  | { error: string }
  | { productId: string; storeId: string };

export async function updateProduct(
  productId: string,
  values: NewProductFormValues,
): Promise<UpdateProductResult> {
  const preparedProduct = prepareProductUpdate(values);

  if (!("data" in preparedProduct)) {
    return {
        error: preparedProduct.error,
    };
    }

    const productData = preparedProduct.data;

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
      error: "You do not have permission to update products in a store.",
    };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .update(productData)
    .eq("id", productId)
    .eq("store_id", storeId)
    .select("id")
    .maybeSingle();

  if (productError) {
    if (productError.code === "23505") {
      return {
        error: "A product with this SKU or product name already exists.",
      };
    }

    return {
      error: "We could not update this product. Please try again.",
    };
  }

  if (!product) {
    return {
      error: "Product not found or you do not have permission to update it.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);

  return {
    productId: product.id,
    storeId,
  };
}