import { Package } from "lucide-react";

interface Props {
  courier: string;
  tracking: string;
  description: string;
}

export default function TrackingCard({
  courier,
  tracking,
  description,
}: Props) {
  return (
    <section className="mt-4 rounded-lg border border-outline/20 bg-surface-container p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-primary">
          <Package size={20} />
        </div>

        <div>
          <p className="font-medium text-on-surface">{courier}</p>

          <p className="text-xs text-on-surface-variant">
            Tracking: {tracking}
          </p>
        </div>
      </div>

      <p className="border-t border-surface-container-highest pt-3 text-sm leading-relaxed text-on-surface-variant">
        {description}
      </p>
    </section>
  );
}