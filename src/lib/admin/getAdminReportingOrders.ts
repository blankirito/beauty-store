import { createClient } from "@/lib/supabase/server";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { toReportingOrder } from "./adminReporting";

export async function getAdminReportingOrders() {
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

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      created_at,
      total,
      payment_status,
      fulfillment_status,
      order_items (
        product_id,
        product_name,
        product_category,
        quantity,
        line_total,
        products (
          category
        )
      )
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Could not load reporting data.");
  }

  return (orders ?? []).map(toReportingOrder);
}