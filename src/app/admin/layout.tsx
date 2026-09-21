import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/shared/AdminShell";
import { getAdminAccessDestination } from "@/lib/auth/getAdminAccessDestination";
import { createClient } from "@/lib/supabase/server";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPlatformAdmin = false;
  let hasStoreAdminAccess = false;

  if (user) {
    const [{ data: profile }, { data: storeMembership }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("is_platform_admin")
          .eq("id", user.id)
          .single(),

        supabase
          .from("store_members")
          .select("id")
          .eq("user_id", user.id)
          .in("role", ["owner", "admin"])
          .limit(1)
          .maybeSingle(),
      ]);

    isPlatformAdmin = profile?.is_platform_admin === true;
    hasStoreAdminAccess = Boolean(storeMembership);
  }

  const destination = getAdminAccessDestination(
    Boolean(user),
    isPlatformAdmin,
    hasStoreAdminAccess,
  );

  if (destination) {
    redirect(destination);
  }

  return (
    <div className="admin-theme min-h-screen">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}