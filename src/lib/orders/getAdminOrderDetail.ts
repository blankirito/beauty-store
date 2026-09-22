import { createClient } from "@/lib/supabase/server";
import {
    getAdminStoreId,
    type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { toAdminOrder } from "./adminOrder";
import { toAdminOrderDetail } from "./adminOrderDetail";
import { toAdminOrderTimeline } from "./adminOrderTimeline";

export async function getAdminOrderDetail(orderNumber: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw new Error("Could not verify the current user.");
    }

    if (!user) {
        return null;
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
        return null;
    }

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
      id,
      order_number,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      payment_status,
      fulfillment_status,
      payment_method,
      subtotal,
      shipping_fee,
      total,
      tracking_carrier,
      tracking_number,
      estimated_delivery_date,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        product_sku,
        unit_price,
        quantity,
        line_total
      ),
      order_shipping_addresses (
        recipient_name,
        phone,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country
      ),
      order_events (
        title,
        note,
        fulfillment_status,
        created_at
      )
    `)
        .eq("store_id", storeId)
        .eq("order_number", orderNumber)
        .maybeSingle();

    if (orderError) {
        throw new Error("Could not load this order.");
    }

    if (!order) {
        return null;
    }

    return {
        order: toAdminOrder(order),
        detail: toAdminOrderDetail(order),
        timeline: toAdminOrderTimeline(order.order_events ?? []),
    };
}