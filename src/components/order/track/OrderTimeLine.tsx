import { Check, Truck } from "lucide-react";
import TrackingCard from "./TrackingCard";

interface Step {
  title: string;
  date: string;
  status: "completed" | "current" | "pending";
  courier?: string;
  tracking?: string;
  description?: string;
}

interface Props {
  steps: readonly Step[];
}

export default function OrderTimeLine({ steps }: Props) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="space-y-0">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1;

          return (
            <div
              key={step.title}
              className={
                isLastStep
                  ? "relative flex gap-4"
                  : "relative flex gap-4 pb-8"
              }
            >
              {!isLastStep && (
                <span className="absolute left-3 top-6 bottom-0 w-px bg-surface-container-highest" />
              )}

              <div
                className={
                  step.status === "current"
                    ? "relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-md"
                    : step.status === "completed"
                      ? "relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"
                      : "relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-outline bg-surface text-outline"
                }
              >
                {step.status === "current" && <Truck size={14} />}

                {step.status === "completed" && <Check size={14} />}
              </div>

              <div className="min-w-0 flex-1 pb-0.5">
                <h4
                  className={
                    step.status === "current"
                      ? "font-semibold text-primary"
                      : "font-semibold text-on-surface"
                  }
                >
                  {step.title}
                </h4>

                <p className="mt-1 text-sm text-on-surface-variant">
                  {step.date}
                </p>

                {step.status === "current" &&
                  step.courier &&
                  step.tracking &&
                  step.description && (
                    <TrackingCard
                      courier={step.courier}
                      tracking={step.tracking}
                      description={step.description}
                    />
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}