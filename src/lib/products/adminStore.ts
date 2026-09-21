export type StoreMembershipRole = "owner" | "admin" | "staff";

type StoreMembership = {
  storeId: string;
  role: StoreMembershipRole;
};

export function getAdminStoreId(
  memberships: StoreMembership[],
): string | null {
  const membership = memberships.find(
    (item) => item.role === "owner" || item.role === "admin",
  );

  return membership?.storeId ?? null;
}