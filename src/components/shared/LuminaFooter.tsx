import Link from "next/link";
import { getLuminaCopyrightNotice } from "@/lib/branding/copyrightNotice";
import { legalLinks } from "@/lib/legal/legalLinks";

export default function LuminaFooter() {
    return (
        <footer className="border-t border-outline/15 px-5 py-6 text-center">
            <div className="mb-2 flex justify-center gap-4 text-xs font-semibold text-primary">
                <Link href={legalLinks.privacy} className="hover:underline">
                    Privacy
                </Link>
                <Link href={legalLinks.terms} className="hover:underline">
                    Terms
                </Link>
            </div>

            <p className="text-xs text-on-surface-variant">
                {getLuminaCopyrightNotice(new Date().getFullYear())}
            </p>
        </footer>
    );
}