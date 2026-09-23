"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function approveStoreApplication(storeId: string) {
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

  const { error } = await supabase.rpc("review_store_application", {
    p_store_id: storeId,
    p_decision: "approve",
    p_review_note: null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/platform");
  revalidatePath("/platform/reviews");
  revalidatePath("/store/[slug]", "page");
  redirect("/platform");
}