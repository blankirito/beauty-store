export type GuestOrderTrackingItem = {
  name: string;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imagePath?: string | null;
};

export type GuestOrderTrackingEvent = {
  title: string;
  note: string;
  fulfillmentStatus: string;
  createdAt: string;
};

export type GuestOrderTrackingAddress = {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type GuestOrderTrackingRpcRow = {
  order_number: string;
  customer_name: string;
  payment_status: string;
  fulfillment_status: string;
  payment_method_label: string;
  payment_method_instructions: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  tracking_carrier: string | null;
  tracking_number: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  shipping_address: GuestOrderTrackingAddress;
  items: GuestOrderTrackingItem[];
  events: GuestOrderTrackingEvent[];
};

export type GuestOrderTracking = {
  orderNumber: string;
  customerName: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethodLabel: string;
  paymentMethodInstructions: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  estimatedDeliveryDate: string | null;
  createdAt: string;
  shippingAddress: GuestOrderTrackingAddress;
  items: GuestOrderTrackingItem[];
  events: GuestOrderTrackingEvent[];
};

export function toGuestOrderTracking(
  row: GuestOrderTrackingRpcRow,
): GuestOrderTracking {
  return {
    orderNumber: row.order_number,
    customerName: row.customer_name,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    paymentMethodLabel: row.payment_method_label,
    paymentMethodInstructions: row.payment_method_instructions,
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    total: row.total,
    trackingCarrier: row.tracking_carrier,
    trackingNumber: row.tracking_number,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    shippingAddress: row.shipping_address,
    items: row.items,
    events: row.events,
  };
}
