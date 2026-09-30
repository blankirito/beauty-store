import { getLuminaCopyrightNotice } from "@/lib/branding/copyrightNotice";

export default function LuminaFooter() {
  return (
    <footer className="border-t border-outline/15 px-5 py-6 text-center">
      <p className="text-xs text-on-surface-variant">
        {getLuminaCopyrightNotice(new Date().getFullYear())}
      </p>
    </footer>
  );
}