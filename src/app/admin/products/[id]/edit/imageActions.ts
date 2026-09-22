"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { prepareProductImageChanges } from "@/lib/products/productImageChanges";
import { createClient } from "@/lib/supabase/server";

type SyncProductImagesInput = {
  productId: string;
  desiredImagePaths: string[];
  primaryImagePath: string | null;
};

type SyncProductImagesResult =
  | { error: string }
  | { productId: string };

export async function syncProductImages({
  productId,
  desiredImagePaths,
  primaryImagePath,
}: SyncProductImagesInput): Promise<SyncProductImagesResult> {
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
      error: "You do not have permission to manage product images.",
    };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("store_id", storeId)
    .maybeSingle();

  if (productError || !product) {
    return {
      error: "Product not found or you do not have permission to edit it.",
    };
  }

  const { data: currentImages, error: currentImagesError } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (currentImagesError) {
    return {
      error: "We could not load the current product images.",
    };
  }

  const existingImagePaths = (currentImages ?? []).map(
    (image) => image.storage_path,
  );

  const existingImagePathSet = new Set(existingImagePaths);

  if (
    desiredImagePaths.some(
      (storagePath) => !existingImagePathSet.has(storagePath),
    )
  ) {
    return {
      error: "One or more product images could not be verified.",
    };
  }

  if (
    primaryImagePath &&
    !desiredImagePaths.includes(primaryImagePath)
  ) {
    return {
      error: "The selected primary image is no longer available.",
    };
  }

  const { removedImagePaths, images } = prepareProductImageChanges({
    existingImagePaths,
    desiredImagePaths,
    primaryImagePath,
  });

  if (removedImagePaths.length > 0) {
    const { error: deleteRecordsError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId)
      .in("storage_path", removedImagePaths);

    if (deleteRecordsError) {
      return {
        error: "We could not remove the selected product images.",
      };
    }

    const { error: deleteStorageError } = await supabase.storage
      .from("product-images")
      .remove(removedImagePaths);

    if (deleteStorageError) {
      return {
        error:
          "The image record was removed, but the file could not be removed.",
      };
    }
  }

  for (const image of images) {
    const { error: sortOrderError } = await supabase
      .from("product_images")
      .update({ sort_order: image.sortOrder })
      .eq("product_id", productId)
      .eq("storage_path", image.storagePath);

    if (sortOrderError) {
      return {
        error: "We could not save the product image order.",
      };
    }
  }

  const { error: clearPrimaryError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (clearPrimaryError) {
    return {
      error: "We could not update the primary product image.",
    };
  }

  if (primaryImagePath) {
    const { error: setPrimaryError } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("product_id", productId)
      .eq("storage_path", primaryImagePath);

    if (setPrimaryError) {
      return {
        error: "We could not set the primary product image.",
      };
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/edit`);

  return {
    productId,
  };
}