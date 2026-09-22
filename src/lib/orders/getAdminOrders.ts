import { createClient } from "@/lib/supabase/server";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { toAdminOrder } from "./adminOrder";

export async function getAdminOrders() {
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
      id,
      order_number,
      customer_id,
      customer_name,
      customer_email,
      payment_status,
      fulfillment_status,
      payment_method,
      total,
      created_at,
      order_items (
        id
      )
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Could not load orders.");
  }

  return (orders ?? []).map(toAdminOrder);
}