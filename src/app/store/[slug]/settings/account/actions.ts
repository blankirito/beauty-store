"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prepareStorefrontAccountUpdate } from "@/lib/storefront/storefrontAccount";

type SaveStorefrontAccountInput = {
  storeSlug: string;
  fullName: string;
  phone: string;
};

export type SaveStorefrontAccountResult =
  | { status: "success" }
  | { status: "requires-sign-in" }
  | { status: "error"; message: string };

export async function saveStorefrontAccount(
  input: SaveStorefrontAccountInput,
): Promise<SaveStorefrontAccountResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "requires-sign-in" };
  }

  try {
    const account = prepareStorefrontAccountUpdate(input);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: account.fullName,
        phone: account.phone || null,
      })
      .eq("id", user.id);

    if (error) {
      return {
        status: "error",
        message: "Could not save your account details.",
      };
    }

    revalidatePath(`/store/${input.storeSlug}/profile`);
    revalidatePath(`/store/${input.storeSlug}/settings`);
    revalidatePath(`/store/${input.storeSlug}/settings/account`);

    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not save your account details.",
    };
  }
}