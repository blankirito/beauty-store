import { createClient } from "@/lib/supabase/server";
import {
  getAdminStoreId,
  type StoreMembershipRole,
} from "@/lib/products/adminStore";
import {
  getMerchantBillingStatus,
  type MerchantPlanCode,
} from "./merchantBilling";
import type { StoreApplicationStatus } from "./storeLifecycle";

type DatabaseApplication = {
  status: StoreApplicationStatus;
  trial_ends_at: string | null;
  trial_started_at: string | null;
};

type DatabaseSubscription = {
  status: string;
  current_period_ends_at: string | null;
  plan_code: string;
  founding_price_locked_until: string | null;
  payment_grace_ends_at: string | null;
};

type DatabasePaymentRequest = {
  id: string;
  plan_code: string;
  monthly_price: number;
  requested_months: number;
  requested_total_amount: number;
  payer_name: string;
  tng_reference: string;
  merchant_note: string | null;
  status: "pending" | "approved" | "rejected";
  review_note: string | null;
  reviewed_at: string | null;
  approved_months: number | null;
  approved_total_amount: number | null;
  approved_access_ends_at: string | null;
  created_at: string;
};

export async function getMerchantBilling() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("Could not verify the current user.");
  }

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

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select(`
      name,
      store_applications (
        status,
        trial_started_at,
        trial_ends_at
      ),
      store_subscriptions (
        status,
        current_period_ends_at,
        plan_code,
        founding_price_locked_until,
        payment_grace_ends_at
      ),
      store_payment_requests (
        id,
        plan_code,
        monthly_price,
        requested_months,
        requested_total_amount,
        payer_name,
        tng_reference,
        merchant_note,
        status,
        review_note,
        reviewed_at,
        approved_months,
        approved_total_amount,
        approved_access_ends_at,
        created_at
      )
    `)
    .eq("id", storeId)
    .single();

  if (storeError) {
    throw new Error("Could not load billing details.");
  }

  const application = Array.isArray(store.store_applications)
    ? (store.store_applications[0] as DatabaseApplication | undefined)
    : (store.store_applications as DatabaseApplication | null);

  const subscription = Array.isArray(store.store_subscriptions)
    ? (store.store_subscriptions[0] as DatabaseSubscription | undefined)
    : (store.store_subscriptions as DatabaseSubscription | null);

  if (!application || !subscription) {
    return null;
  }

  const tngRecipientName = process.env.TNG_RECIPIENT_NAME?.trim() ?? "";
  const tngRecipientNumber = process.env.TNG_RECIPIENT_NUMBER?.trim() ?? "";

  const paymentRequests = (
    (store.store_payment_requests ?? []) as DatabasePaymentRequest[]
  ).sort(
    (first, second) =>
      new Date(second.created_at).getTime() -
      new Date(first.created_at).getTime(),
  );

  return {
    storeId,
    storeName: store.name,
    tngPayment:
      tngRecipientName && tngRecipientNumber
        ? {
            recipientName: tngRecipientName,
            recipientNumber: tngRecipientNumber,
          }
        : null,
    paymentRequests,
    ...getMerchantBillingStatus({
      applicationStatus: application.status,
      trialStartedAt: application.trial_started_at,
      trialEndsAt: application.trial_ends_at,
      subscriptionStatus: subscription.status,
      currentPeriodEndsAt: subscription.current_period_ends_at,
      planCode: subscription.plan_code as MerchantPlanCode,
      foundingPriceLockedUntil: subscription.founding_price_locked_until,
      paymentGraceEndsAt: subscription.payment_grace_ends_at,
    }),
  };
}