import { createClient } from "@/lib/supabase/server";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { toStorePaymentMethod } from "./storePaymentMethod";

export async function getAdminStorePaymentMethods() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("Could not verify the current user.");
  }

  if (!user) {
    return [];
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .order("created_at", { ascending: true });

  if (membershipError) {
    throw new Error("Could not load store access.");
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return [];
  }

  const { data: paymentMethods, error: paymentMethodsError } =
    await supabase
      .from("store_payment_methods")
      .select(`
        id,
        store_id,
        code,
        label,
        instructions,
        is_enabled,
        sort_order
      `)
      .eq("store_id", storeId)
      .order("sort_order", { ascending: true });

  if (paymentMethodsError) {
    throw new Error("Could not load payment methods.");
  }

  return (paymentMethods ?? []).map(toStorePaymentMethod);
}