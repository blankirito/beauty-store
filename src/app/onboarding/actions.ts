"use server";

import { revalidatePath } from "next/cache";
import {
  normalizeStoreSlug,
  type StoreApplicationInput,
  validateStoreApplicationInput,
} from "@/lib/merchants/storeApplication";
import { getStoreApplicationMutation } from "@/lib/merchants/storeApplicationMutation";
import type { StoreApplicationStatus } from "@/lib/merchants/storeLifecycle";
import { createClient } from "@/lib/supabase/server";

type SaveStoreApplicationInput = StoreApplicationInput & {
  submit: boolean;
};

type SaveStoreApplicationResult =
  | {
      type: "validation_error";
      fieldErrors: Record<string, string>;
    }
  | {
      type: "error";
      error: string;
    }
  | {
      type: "success";
      storeId: string;
      status: "draft" | "pending_review";
    };

export async function saveStoreApplication(
  input: SaveStoreApplicationInput,
): Promise<SaveStoreApplicationResult> {
  const { fieldErrors } = validateStoreApplicationInput(input);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      type: "validation_error",
      fieldErrors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      type: "error",
      error: "Please sign in before saving your store application.",
    };
  }

  const { data: ownerMembership, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .maybeSingle();

  if (membershipError) {
    return {
      type: "error",
      error: "We could not confirm your store application.",
    };
  }

  let storeId: string | null = ownerMembership?.store_id ?? null;
  let applicationStatus: StoreApplicationStatus | null = null;

  if (storeId) {
    const { data: application, error: applicationError } = await supabase
      .from("store_applications")
      .select("status")
      .eq("store_id", storeId)
      .maybeSingle();

    if (applicationError || !application) {
      return {
        type: "error",
        error: "We could not load your store application.",
      };
    }

    applicationStatus = application.status as StoreApplicationStatus;
  }

  const mutation = getStoreApplicationMutation(applicationStatus);

  if (mutation.type === "error") {
    return {
      type: "error",
      error: mutation.message,
    };
  }

  if (mutation.type === "create") {
    const { data, error } = await supabase.rpc(
      "create_store_application",
      {
        p_name: input.name.trim(),
        p_slug: normalizeStoreSlug(input.slug),
        p_category: input.category.trim(),
        p_contact_name: input.contactName.trim(),
        p_contact_phone: input.phone.trim(),
        p_description: input.description.trim(),
      },
    );

    if (error || !data) {
      return {
        type: "error",
        error: error?.message ?? "We could not create your store application.",
      };
    }

    storeId = data as string;
  }

  if (mutation.type === "update") {
    if (!storeId) {
      return {
        type: "error",
        error: "We could not find your store application.",
      };
    }

    const { error } = await supabase.rpc(
      "update_store_application_draft",
      {
        p_store_id: storeId,
        p_name: input.name.trim(),
        p_slug: normalizeStoreSlug(input.slug),
        p_category: input.category.trim(),
        p_contact_name: input.contactName.trim(),
        p_contact_phone: input.phone.trim(),
        p_description: input.description.trim(),
      },
    );

    if (error) {
      return {
        type: "error",
        error: error.message,
      };
    }
  }

  if (!storeId) {
    return {
      type: "error",
      error: "We could not save your store application.",
    };
  }

  if (input.submit) {
    const { error } = await supabase.rpc("submit_store_application", {
      p_store_id: storeId,
    });

    if (error) {
      return {
        type: "error",
        error: error.message,
      };
    }
  }

  revalidatePath("/onboarding");

  return {
    type: "success",
    storeId,
    status: input.submit ? "pending_review" : "draft",
  };
}