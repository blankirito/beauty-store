"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prepareStorefrontEmailUpdate } from "@/lib/storefront/storefrontEmail";

type UpdateStorefrontEmailInput = {
  storeSlug: string;
  newEmail: string;
  currentPassword: string;
};

export type UpdateStorefrontEmailResult =
  | { status: "verification-sent" }
  | { status: "requires-sign-in" }
  | { status: "error"; message: string };

export async function updateStorefrontEmail(
  input: UpdateStorefrontEmailInput,
): Promise<UpdateStorefrontEmailResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { status: "requires-sign-in" };
  }

  try {
    const emailUpdate = prepareStorefrontEmailUpdate({
      currentEmail: user.email,
      newEmail: input.newEmail,
      currentPassword: input.currentPassword,
    });

    const { error: currentPasswordError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: emailUpdate.currentPassword,
      });

    if (currentPasswordError) {
      return {
        status: "error",
        message: "Your current password is incorrect.",
      };
    }

    const requestHeaders = await headers();
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    const host =
      requestHeaders.get("x-forwarded-host") ??
      requestHeaders.get("host");

    const emailRedirectTo = host
      ? `${protocol}://${host}/store/${input.storeSlug}/settings/account`
      : undefined;

    const { error: updateEmailError } = await supabase.auth.updateUser(
      { email: emailUpdate.newEmail },
      { emailRedirectTo },
    );

    if (updateEmailError) {
      return {
        status: "error",
        message:
          "Could not start your email change. Please check the address and try again.",
      };
    }

    return { status: "verification-sent" };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not start your email change. Please try again.",
    };
  }
}