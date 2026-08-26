/**
 * Rail card tracking onboarding progress.
 *
 * The step track is drawn as equal flex segments rather than a percentage
 * bar, so a partially complete step reads as discrete rather than smeared.
 */
import type { Onboarding } from "@/data/types";
import { IconClose, IconCtaArrow } from "../icons";
import { cn } from "@/lib/utils";

interface OnboardingCardProps {
  onboarding: Onboarding;
}

export function OnboardingCard({ onboarding }: OnboardingCardProps) {
  const { stepsComplete, stepsTotal } = onboarding;
  const percent = Math.floor((stepsComplete / stepsTotal) * 100);

  return (
    <section
      className="relative h-[16.6875rem] overflow-hidden border-[0.0625rem] border-rule"
      aria-label="Onboarding"
    >
      {/* Artwork fills the card, positioned as in the comp (178:6441); the
          fill carries a darkening adjustment measured against the reference. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed art */}
      <img
        className="pointer-events-none absolute left-[-14.05%] top-[-3.9%] h-[107.84%] w-[128.08%] max-w-none object-cover brightness-[0.775] saturate-[1.08]"
        src={onboarding.art}
        alt=""
      />
      <div className="relative flex h-full flex-col px-[1.55rem] pb-[1.1875rem] pt-[1.375rem]">
        <div className="flex items-start justify-between">
          <span className="text-[0.8125rem] font-normal uppercase leading-[1.2] tracking-[0.04em] text-onboarding-label">
            Onboarding
          </span>
          <button
            className="mt-[0.0625rem] block h-[0.98rem] w-[0.98rem] p-0 text-onboarding-label"
            type="button"
            aria-label="Dismiss"
          >
            <IconClose />
          </button>
        </div>
        <h2 className="t-title-plate mt-[1.1875rem] max-w-[16.5rem] text-inverse">
          {onboarding.title}
        </h2>
        <div className="mt-[1.1875rem] flex gap-[0.1625rem]" aria-hidden="true">
          {Array.from({ length: stepsTotal }, (_, i) => (
            <i
              key={i}
              className={cn(
                "h-[0.8125rem] flex-1",
                i < stepsComplete ? "bg-inverse" : "bg-track-on-dark",
              )}
            />
          ))}
        </div>
        <div className="mt-[0.625rem] flex justify-between text-xs leading-[1.2] text-onboarding-label">
          <span>
            {stepsComplete} of {stepsTotal} complete
          </span>
          <span>{percent}%</span>
        </div>
        <a
          className="mt-auto flex h-[2.4375rem] items-center justify-center gap-[0.4375rem] rounded-control bg-inverse text-sm font-medium leading-[normal] text-icon-active no-underline"
          href="#"
        >
          Finish setup
          <span className="block h-[0.975rem] w-[0.975rem]" aria-hidden="true">
            <IconCtaArrow />
          </span>
        </a>
      </div>
    </section>
  );
}
