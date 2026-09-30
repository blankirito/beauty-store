import LuminaFooter from "@/components/shared/LuminaFooter";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <LuminaFooter />
    </div>
  );
}