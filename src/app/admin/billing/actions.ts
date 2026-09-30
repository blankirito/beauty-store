"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { prepareManualPaymentRequest } from "@/lib/merchants/manualSubscriptionPayment";

export type ManualPaymentRequestState = {
  error?: string;
  success?: string;
};

export async function submitManualTngPaymentRequest(
  _previousState: ManualPaymentRequestState,
  formData: FormData,
): Promise<ManualPaymentRequestState> {
  const prepared = prepareManualPaymentRequest(formData);

  if ("error" in prepared) {
    return prepared;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in again before submitting payment." };
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .order("created_at", { ascending: true });

  if (membershipError) {
    return { error: "Could not confirm your store access." };
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return { error: "No eligible store was found for this payment request." };
  }

  const { error } = await supabase.rpc(
    "create_store_payment_request",
    {
      p_store_id: storeId,
      p_months: prepared.months,
      p_payer_name: prepared.payerName,
      p_tng_reference: prepared.tngReference,
      p_note: prepared.note,
    },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/billing");
  revalidatePath("/platform/subscriptions");

  return {
    success: "Your TNG payment request has been submitted for review.",
  };
}