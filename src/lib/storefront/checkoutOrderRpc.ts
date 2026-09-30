import type { GuestCheckoutRequest } from "./guestCheckout";

export function buildCheckoutOrderRpcParams(
  request: GuestCheckoutRequest,
  customerId: string | null,
) {
  return {
    p_store_slug: request.storeSlug,
    p_customer_name: request.customerName,
    p_customer_email: request.customerEmail,
    p_customer_phone: request.customerPhone,
    p_address_line_1: request.addressLine1,
    p_address_line_2: request.addressLine2,
    p_city: request.city,
    p_state: request.state,
    p_postal_code: request.postalCode,
    p_country: request.country,
    p_payment_method_id: request.paymentMethodId,
    p_items: request.items,
    p_customer_id: customerId,
  };
}