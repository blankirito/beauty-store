import AdminShell from "@/components/admin/shared/AdminShell";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="admin-theme min-h-screen">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}