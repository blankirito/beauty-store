import { toAdminNotification } from "./orderNotifications";
import { createClient } from "../supabase/server";

type GetAdminNotificationsOptions = {
  limit?: number;
};

export async function getAdminNotifications(
  options?: GetAdminNotificationsOptions,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const limit = options ? options.limit : 10;

  const query = supabase
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
    .order("created_at", { ascending: false });

  const { data, error } =
    limit === undefined ? await query : await query.limit(limit);

  if (error) {
    throw new Error("Could not load notifications.");
  }

  return (data ?? []).map((notification) =>
    toAdminNotification(notification),
  );
}