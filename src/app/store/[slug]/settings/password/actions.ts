"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prepareStorefrontPasswordUpdate } from "@/lib/storefront/storefrontPassword";

type UpdateStorefrontPasswordInput = {
  storeSlug: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateStorefrontPasswordResult =
  | { status: "success" }
  | { status: "requires-sign-in" }
  | { status: "error"; message: string };

export async function updateStorefrontPassword(
  input: UpdateStorefrontPasswordInput,
): Promise<UpdateStorefrontPasswordResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { status: "requires-sign-in" };
  }

  try {
    const passwordUpdate = prepareStorefrontPasswordUpdate(input);

    const { error: currentPasswordError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordUpdate.currentPassword,
      });

    if (currentPasswordError) {
      return {
        status: "error",
        message: "Your current password is incorrect.",
      };
    }

    const { error: updatePasswordError } = await supabase.auth.updateUser({
      password: passwordUpdate.newPassword,
    });

    if (updatePasswordError) {
      return {
        status: "error",
        message: "Could not update your password. Please try again.",
      };
    }

    revalidatePath(`/store/${input.storeSlug}/settings/password`);

    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not update your password. Please try again.",
    };
  }
}