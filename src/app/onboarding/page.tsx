import { redirect } from "next/navigation";
import StoreApplicationForm from "@/components/onboarding/StoreApplicationForm";
import { canAccessOnboarding } from "@/lib/merchants/canAccessOnboarding";
import type { StoreApplicationStatus } from "@/lib/merchants/storeLifecycle";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: ownerMembership } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .maybeSingle();

  const hasMerchantIntent = user.user_metadata.merchant_intent === true;
  const hasOwnerMembership = Boolean(ownerMembership);

  if (!canAccessOnboarding({ hasMerchantIntent, hasOwnerMembership })) {
    redirect("/");
  }

  let initialData = {
    name: "",
    slug: "",
    category: "",
    contactName:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : "",
    phone:
      typeof user.user_metadata.phone === "string"
        ? user.user_metadata.phone
        : "",
    description: "",
  };

  let applicationStatus: StoreApplicationStatus | null = null;

  if (ownerMembership) {
    const [{ data: store }, { data: application }] = await Promise.all([
      supabase
        .from("stores")
        .select("name, slug, description")
        .eq("id", ownerMembership.store_id)
        .maybeSingle(),
      supabase
        .from("store_applications")
        .select("status, category, contact_name, contact_phone")
        .eq("store_id", ownerMembership.store_id)
        .maybeSingle(),
    ]);

    if (!store || !application) {
      redirect("/admin");
    }

    applicationStatus = application.status as StoreApplicationStatus;

    if (applicationStatus !== "draft" && applicationStatus !== "rejected") {
      redirect("/admin");
    }

    initialData = {
      name: store.name,
      slug: store.slug,
      category: application.category,
      contactName: application.contact_name,
      phone: application.contact_phone,
      description: store.description ?? "",
    };
  }

  return (
    <StoreApplicationForm
      initialData={initialData}
      applicationStatus={applicationStatus}
    />
  );
}