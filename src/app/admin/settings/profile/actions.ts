"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import {
  getStoreProfileSaveError,
  prepareStoreProfileUpdate,
} from "@/lib/admin/storeProfile";
import { createClient } from "@/lib/supabase/server";

export type UpdateStoreProfileInput = {
  name: string;
  slug: string;
  description: string;
};

export type UpdateStoreProfileResult =
  | {
      status: "success";
      data: {
        name: string;
        slug: string;
        description: string | null;
      };
    }
  | {
      status: "error";
      message: string;
    };

export async function updateStoreProfile(
  input: UpdateStoreProfileInput,
): Promise<UpdateStoreProfileResult> {
  try {
    const profile = prepareStoreProfileUpdate(input);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "You must be signed in to update your store profile.",
      };
    }

    const { data: memberships, error: membershipError } = await supabase
      .from("store_members")
      .select("store_id, role")
      .eq("user_id", user.id)
      .in("role", ["owner", "admin"]);

    if (membershipError) {
      return {
        status: "error",
        message: "We could not confirm your store access.",
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
        status: "error",
        message: "You do not have permission to update this store.",
      };
    }

    const { data: currentStore, error: storeError } = await supabase
      .from("stores")
      .select("slug")
      .eq("id", storeId)
      .maybeSingle();

    if (storeError || !currentStore) {
      return {
        status: "error",
        message: "We could not load your store profile.",
      };
    }

    const { error: updateError } = await supabase.rpc(
      "update_store_profile",
      {
        p_store_id: storeId,
        p_name: profile.name,
        p_slug: profile.slug,
        p_description: profile.description,
      },
    );

    if (updateError) {
      return {
        status: "error",
        message: getStoreProfileSaveError(updateError),
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/settings/profile");
    revalidatePath(`/store/${currentStore.slug}`);
    revalidatePath(`/store/${profile.slug}`);

    return {
      status: "success",
      data: profile,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "We could not save your store profile. Please try again.",
    };
  }
}