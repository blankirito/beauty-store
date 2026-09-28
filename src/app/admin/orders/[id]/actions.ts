"use server";

import { revalidatePath } from "next/cache";
import {
  prepareFulfillmentUpdate,
  type FulfillmentStatus,
} from "@/lib/orders/fulfillmentUpdate";
import { preparePaymentConfirmation } from "@/lib/orders/paymentUpdate";
import { createClient } from "@/lib/supabase/server";
import { prepareShipmentUpdate } from "@/lib/orders/shipmentUpdate";

type UpdateOrderResult =
  | { error: string }
  | { orderNumber: string };

export async function confirmOrderPayment(
  orderNumber: string,
): Promise<UpdateOrderResult> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("payment_status, fulfillment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError || !order) {
    return {
      error: "Order not found or you do not have permission to update it.",
    };
  }

  const preparedUpdate = preparePaymentConfirmation({
    paymentStatus: order.payment_status,
    fulfillmentStatus: order.fulfillment_status,
  });

  if ("error" in preparedUpdate && preparedUpdate.error) {
    return {
      error: preparedUpdate.error,
    };
  }

  const { error: updateError } = await supabase.rpc("mark_order_paid", {
    p_order_number: orderNumber,
    p_note: "Payment was confirmed by store staff.",
  });

  if (updateError) {
    return {
      error: "We could not confirm this payment. Please try again.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/customers");
  revalidatePath("/admin/analytics");

  return { orderNumber };
}

export async function updateOrderFulfillment(
  orderNumber: string,
  nextStatus: FulfillmentStatus,
): Promise<UpdateOrderResult> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("fulfillment_status, payment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError || !order) {
    return {
      error: "Order not found or you do not have permission to update it.",
    };
  }

  const preparedUpdate = prepareFulfillmentUpdate({
    currentStatus: order.fulfillment_status as FulfillmentStatus,
    nextStatus,
    paymentStatus: order.payment_status,
  });

  if ("error" in preparedUpdate && preparedUpdate.error) {
    return {
      error: preparedUpdate.error,
    };
  }

  const { error: updateError } = await supabase.rpc(
    "advance_order_fulfillment",
    {
      p_order_number: orderNumber,
      p_next_status: nextStatus,
      p_note: null,
    },
  );

  if (updateError) {
    return {
      error: "We could not update this order. Please try again.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);

  return { orderNumber };
}

export async function shipOrder(
  orderNumber: string,
  carrier: string,
  trackingNumber: string,
): Promise<UpdateOrderResult> {
  const preparedShipment = prepareShipmentUpdate({
    carrier,
    trackingNumber,
  });

  if (!("data" in preparedShipment)) {
    return {
      error: preparedShipment.error,
    };
  }

  const supabase = await createClient();

  const { error: shipmentError } = await supabase.rpc("ship_order", {
    p_order_number: orderNumber,
    p_tracking_carrier: preparedShipment.data.tracking_carrier,
    p_tracking_number: preparedShipment.data.tracking_number,
    p_note: preparedShipment.event.note,
  });

  if (shipmentError) {
    return {
      error: "We could not mark this order as shipped. Please try again.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);

  return { orderNumber };
}