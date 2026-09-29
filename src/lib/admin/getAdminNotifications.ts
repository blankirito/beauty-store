import { toAdminNotification } from "./orderNotifications";
import { createClient } from "../supabase/server";

export async function getAdminNotifications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("store_notifications")
    .select(`
      id,
      order_id,
      title,
      body,
      read_at,
      created_at,
      orders (
        order_number
      )
    `)
    .eq("recipient_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error("Could not load notifications.");
  }

  return (data ?? []).map((notification) =>
    toAdminNotification(notification),
  );
}