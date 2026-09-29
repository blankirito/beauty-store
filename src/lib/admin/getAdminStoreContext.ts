import { createClient } from "../supabase/server";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "../products/adminStore";

type AdminStoreContextInput = {
  storeName: string;
  profileName: string | null;
  role: "owner" | "admin";
};

export type AdminStoreContext = {
  storeName: string;
  memberName: string;
  roleLabel: "Owner" | "Admin";
};

export function toAdminStoreContext({
  storeName,
  profileName,
  role,
}: AdminStoreContextInput): AdminStoreContext {
  return {
    storeName,
    memberName: profileName?.trim() || "Account",
    roleLabel: role === "owner" ? "Owner" : "Admin",
  };
}

export async function getAdminStoreContext(): Promise<AdminStoreContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("store_members")
    .select("store_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .order("created_at", { ascending: true });

  if (membershipError) {
    throw new Error("Could not load store access.");
  }

  const storeId = getAdminStoreId(
    (memberships ?? []).map((membership) => ({
      storeId: membership.store_id,
      role: membership.role as StoreMembershipRole,
    })),
  );

  if (!storeId) {
    return null;
  }

  const membership = (memberships ?? []).find(
    (item) =>
      item.store_id === storeId &&
      (item.role === "owner" || item.role === "admin"),
  );

  if (!membership) {
    return null;
  }

  const [
    { data: profile, error: profileError },
    { data: store, error: storeError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("stores")
      .select("name")
      .eq("id", storeId)
      .maybeSingle(),
  ]);

  if (profileError || storeError) {
    throw new Error("Could not load store profile.");
  }

  if (!store?.name) {
    return null;
  }

  return toAdminStoreContext({
    storeName: store.name,
    profileName: profile?.full_name ?? null,
    role: membership.role,
  });
}