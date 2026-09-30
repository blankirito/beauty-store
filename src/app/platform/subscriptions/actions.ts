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

export async function suspendStoreSubscription(
    storeId: string,
    note: string,
): Promise<{ error?: string }> {
    const supabase = await getPlatformAdminClient();

    const { error } = await supabase.rpc("review_store_application", {
        p_store_id: storeId,
        p_decision: "suspend",
        p_review_note: note.trim() || null,
    });

    if (error) {
        return {
            error: error.message,
        };
    }

    revalidateSubscriptionPages();

    return {};
}

export async function reviewManualPaymentRequest(
  requestId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await getPlatformAdminClient();

  const decision = String(formData.get("decision") ?? "");
  const months = Number(formData.get("months"));
  const reviewNote = String(formData.get("reviewNote") ?? "").trim();

  if (decision !== "approve" && decision !== "reject") {
    return { error: "Choose approve or reject." };
  }

  if (decision === "approve" && ![1, 3, 12].includes(months)) {
    return { error: "Choose 1, 3, or 12 months." };
  }

  if (decision === "reject" && !reviewNote) {
    return { error: "Enter a rejection reason." };
  }

  const { error } = await supabase.rpc(
    "review_store_payment_request",
    {
      p_request_id: requestId,
      p_decision: decision,
      p_months: decision === "approve" ? months : null,
      p_review_note: reviewNote || null,
    },
  );

  if (error) {
    return { error: error.message };
  }

  revalidateSubscriptionPages();

  return {};
}