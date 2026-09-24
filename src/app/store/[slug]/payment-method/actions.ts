"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SaveStorefrontPaymentPreferenceInput = {
  storeId: string;
  storeSlug: string;
  paymentMethodId: string;
};

export async function saveStorefrontPaymentPreference({
  storeId,
  storeSlug,
  paymentMethodId,
}: SaveStorefrontPaymentPreferenceInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Please sign in before saving a payment preference.",
    };
  }

  const { error } = await supabase
    .from("customer_store_payment_preferences")
    .upsert(
      {
        user_id: user.id,
        store_id: storeId,
        payment_method_id: paymentMethodId,
      },
      {
        onConflict: "user_id,store_id",
      },
    );

  if (error) {
    return {
      error: "Could not save your payment preference.",
    };
  }

  revalidatePath(`/store/${storeSlug}/payment-method`);
  revalidatePath(`/store/${storeSlug}/checkout`);

  return {
    success: true,
  };
}