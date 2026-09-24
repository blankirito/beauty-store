"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type StorefrontAddressInput = {
  storeSlug: string;
  addressId?: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type StorefrontAddressActionResult =
  | { status: "success" }
  | { status: "requires-sign-in" }
  | { status: "error"; message: string };

function revalidateStorefrontAddressPaths(storeSlug: string) {
  revalidatePath(`/store/${storeSlug}/saved-addresses`);
  revalidatePath(`/store/${storeSlug}/checkout`);
}

export async function saveStorefrontAddress(
  input: StorefrontAddressInput,
): Promise<StorefrontAddressActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "requires-sign-in" };
  }

  const address = {
    label: input.label.trim(),
    recipient_name: input.recipientName.trim(),
    phone: input.phone.trim(),
    address_line_1: input.addressLine1.trim(),
    address_line_2: input.addressLine2.trim() || null,
    city: input.city.trim(),
    state: input.state.trim(),
    postal_code: input.postalCode.trim(),
    country: input.country.trim(),
  };

  if (
    !address.label ||
    !address.recipient_name ||
    !address.phone ||
    !address.address_line_1 ||
    !address.city ||
    !address.state ||
    !address.postal_code ||
    !address.country
  ) {
    return {
      status: "error",
      message: "Please complete all required address fields.",
    };
  }

  if (input.addressId) {
    const update = input.isDefault
      ? { ...address, is_default: true }
      : address;

    const { error } = await supabase
      .from("customer_addresses")
      .update(update)
      .eq("id", input.addressId)
      .eq("user_id", user.id);

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  } else {
    const insert = input.isDefault
      ? { ...address, user_id: user.id, is_default: true }
      : { ...address, user_id: user.id };

    const { error } = await supabase
      .from("customer_addresses")
      .insert(insert);

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  revalidateStorefrontAddressPaths(input.storeSlug);

  return { status: "success" };
}

export async function setDefaultStorefrontAddress(
  storeSlug: string,
  addressId: string,
): Promise<StorefrontAddressActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "requires-sign-in" };
  }

  const { error } = await supabase
    .from("customer_addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateStorefrontAddressPaths(storeSlug);

  return { status: "success" };
}

export async function deleteStorefrontAddress(
  storeSlug: string,
  addressId: string,
): Promise<StorefrontAddressActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "requires-sign-in" };
  }

  const { error } = await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateStorefrontAddressPaths(storeSlug);

  return { status: "success" };
}