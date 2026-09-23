export function canViewStorefrontOrder(
  orderCustomerId: string | null,
  userId: string | null,
) {
  return Boolean(orderCustomerId && userId && orderCustomerId === userId);
}