"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

export async function markAdminNotificationRead(
  notificationId: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const service = createServiceClient();

    const { error } = await service.rpc(
    "mark_store_notification_read",
    {
      p_notification_id: notificationId,
      p_recipient_user_id: user.id,
    },
  );

  if (error) {
    throw new Error("Could not mark notification as read.");
  }

  revalidatePath("/admin", "layout");
}