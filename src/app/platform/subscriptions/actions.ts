"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getPlatformAdminClient() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_platform_admin) {
    redirect("/admin");
  }

  return supabase;
}

function revalidateSubscriptionPages() {
  revalidatePath("/platform");
  revalidatePath("/platform/subscriptions");
  revalidatePath("/admin");
  revalidatePath("/admin/billing");
  revalidatePath("/store/[slug]", "page");
}

export async function grantComplimentaryAccess(
  storeId: string,
  formData: FormData,
) {
  const supabase = await getPlatformAdminClient();

  const reason = String(formData.get("reason") ?? "").trim() || null;

  const { error } = await supabase.rpc("set_store_complimentary_access", {
    p_store_id: storeId,
    p_decision: "grant",
    p_reason: reason,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateSubscriptionPages();
}

export async function removeComplimentaryAccess(storeId: string) {
  const supabase = await getPlatformAdminClient();

  const { error } = await supabase.rpc("set_store_complimentary_access", {
    p_store_id: storeId,
    p_decision: "remove",
    p_reason: null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateSubscriptionPages();
}