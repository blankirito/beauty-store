"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import { prepareStorePaymentMethodUpdate } from "@/lib/payments/storePaymentMethodUpdate";
import { createClient } from "@/lib/supabase/server";
import { prepareNewStorePaymentMethod } from "@/lib/payments/newStorePaymentMethod";

type UpdateStorePaymentMethodInput = {
  paymentMethodId: string;
  label: string;
  instructions: string;
  isEnabled: boolean;
};

export async function updateStorePaymentMethod(
  input: UpdateStorePaymentMethodInput,
) {
  const preparedUpdate = prepareStorePaymentMethodUpdate({
    label: input.label,
    instructions: input.instructions,
    isEnabled: input.isEnabled,
  });

  if ("error" in preparedUpdate) {
    return preparedUpdate;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be signed in to update payment methods.",
    };
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"]);

  if (membershipError) {
    return {
      error: "We could not confirm your store access.",
    };
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return {
      error: "You do not have permission to manage this store.",
    };
  }

  const { data: paymentMethod, error: paymentMethodError } = await supabase
    .from("store_payment_methods")
    .update({
      label: preparedUpdate.data.label,
      instructions: preparedUpdate.data.instructions,
      is_enabled: preparedUpdate.data.isEnabled,
    })
    .eq("id", input.paymentMethodId)
    .eq("store_id", storeId)
    .select("id")
    .maybeSingle();

  if (paymentMethodError || !paymentMethod) {
    return {
      error:
        "Payment method not found or you do not have permission to update it.",
    };
  }

  revalidatePath("/admin/settings/payments");

  return {
    paymentMethodId: paymentMethod.id,
  };
}

type CreateStorePaymentMethodInput = {
  label: string;
  instructions: string;
};

export async function createStorePaymentMethod(
  input: CreateStorePaymentMethodInput,
) {
  const preparedMethod = prepareNewStorePaymentMethod(input);

  if ("error" in preparedMethod) {
    return preparedMethod;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be signed in to add payment methods.",
    };
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"]);

  if (membershipError) {
    return {
      error: "We could not confirm your store access.",
    };
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return {
      error: "You do not have permission to manage this store.",
    };
  }

  const { data: paymentMethod, error: paymentMethodError } = await supabase
    .from("store_payment_methods")
    .insert({
      store_id: storeId,
      code: `custom_${crypto.randomUUID()}`,
      label: preparedMethod.data.label,
      instructions: preparedMethod.data.instructions,
      is_enabled: preparedMethod.data.isEnabled,
      sort_order: 999,
    })
    .select("id")
    .single();

  if (paymentMethodError || !paymentMethod) {
    return {
      error: "We could not add this payment method. Please try again.",
    };
  }

  revalidatePath("/admin/settings/payments");

  return {
    paymentMethodId: paymentMethod.id,
  };
}