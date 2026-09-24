"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ToggleStorefrontWishlistItemInput = {
  storeSlug: string;
  productSlug: string;
  productId: string;
};

export type ToggleStorefrontWishlistItemResult =
  | {
      status: "success";
      isWishlisted: boolean;
    }
  | {
      status: "requires-sign-in";
    }
  | {
      status: "error";
      message: string;
    };

export async function toggleStorefrontWishlistItem({
  storeSlug,
  productSlug,
  productId,
}: ToggleStorefrontWishlistItemInput): Promise<ToggleStorefrontWishlistItemResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "requires-sign-in",
    };
  }

  const { data: existingItem, error: existingItemError } = await supabase
    .from("customer_wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingItemError) {
    return {
      status: "error",
      message: "Could not check your wishlist.",
    };
  }

  if (existingItem) {
    const { error } = await supabase
      .from("customer_wishlist_items")
      .delete()
      .eq("id", existingItem.id);

    if (error) {
      return {
        status: "error",
        message: "Could not remove this product from your wishlist.",
      };
    }

    revalidatePath(`/store/${storeSlug}/product/${productSlug}`);
    revalidatePath(`/store/${storeSlug}`);

    return {
      status: "success",
      isWishlisted: false,
    };
  }

  const { error } = await supabase
    .from("customer_wishlist_items")
    .insert({
      user_id: user.id,
      product_id: productId,
    });

  if (error) {
    return {
      status: "error",
      message: "Could not add this product to your wishlist.",
    };
  }

  revalidatePath(`/store/${storeSlug}/product/${productSlug}`);
  revalidatePath(`/store/${storeSlug}`);

  return {
    status: "success",
    isWishlisted: true,
  };
}