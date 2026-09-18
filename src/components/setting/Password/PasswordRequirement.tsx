import { Info } from "lucide-react";

export default function PasswordRequirement() {
  return (
    <div className="rounded-lg border border-outline/20 bg-surface-container-low p-4">
      <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-on-surface-variant">
        <Info size={16} className="text-primary" />
        Password Requirements
      </p>

      <ul className="list-disc space-y-1 pl-5 text-[13px] text-on-surface-variant">
        <li>Minimum of 8 characters</li>
        <li>Include at least one symbol (!@#$%^&amp;*)</li>
        <li>Include at least one number</li>
      </ul>
    </div>
  );
}