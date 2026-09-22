import { createClient } from "@/lib/supabase/server";
import {
  toGuestOrderTracking,
  type GuestOrderTracking,
  type GuestOrderTrackingRpcRow,
} from "./guestOrderTracking";

export async function getGuestOrderTracking(
  storeSlug: string,
  orderNumber: string,
  trackingToken: string,
): Promise<GuestOrderTracking | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_guest_order_tracking",
    {
      p_store_slug: storeSlug,
      p_order_number: orderNumber,
      p_tracking_token: trackingToken,
    },
  );

  if (error) {
    console.error("Unable to load guest order tracking:", error.message);
    return null;
  }

  const row = (data ?? [])[0] as GuestOrderTrackingRpcRow | undefined;

  return row ? toGuestOrderTracking(row) : null;
}