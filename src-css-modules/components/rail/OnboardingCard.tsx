import type { Onboarding } from "@/data/types";
import { IconClose, IconCtaArrow } from "../icons";
import styles from "./OnboardingCard.module.css";

interface OnboardingCardProps {
  onboarding: Onboarding;
}

export function OnboardingCard({ onboarding }: OnboardingCardProps) {
  const { stepsComplete, stepsTotal } = onboarding;
  const percent = Math.floor((stepsComplete / stepsTotal) * 100);

  return (
    <section className={styles.card} aria-label="Onboarding">
      {/* Artwork fills the card, positioned as in the comp (178:6441). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed art */}
      <img className={styles.art} src={onboarding.art} alt="" />
      <div className={styles.content}>
        <div className={styles.head}>
          <span className={styles.label}>Onboarding</span>
          <button className={styles.close} type="button" aria-label="Dismiss">
            <IconClose />
          </button>
        </div>
        <h2 className={`${styles.title} t-title-plate`}>{onboarding.title}</h2>
        <div className={styles.segbar} aria-hidden="true">
          {Array.from({ length: stepsTotal }, (_, i) => (
            <i key={i} className={i < stepsComplete ? styles.segFilled : undefined} />
          ))}
        </div>
        <div className={styles.meta}>
          <span>
            {stepsComplete} of {stepsTotal} complete
          </span>
          <span>{percent}%</span>
        </div>
        <a className={styles.cta} href="#">
          Finish setup
          <span className={styles.ctaArrow} aria-hidden="true">
            <IconCtaArrow />
          </span>
        </a>
      </div>
    </section>
  );
}
