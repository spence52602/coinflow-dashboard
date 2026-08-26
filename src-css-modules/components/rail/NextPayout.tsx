import type { Payout } from "@/data/types";
import { formatCurrency } from "@/data/format";
import { IconCtaArrow } from "../icons";
import styles from "./NextPayout.module.css";

interface NextPayoutProps {
  payout: Payout;
}

export function NextPayout({ payout }: NextPayoutProps) {
  return (
    <section className={styles.card} aria-label="Next payout">
      <div className={styles.head}>
        <span className={styles.label}>Next payout</span>
        <span className={styles.chip}>
          <i />
          {payout.status}
        </span>
      </div>
      <div className={styles.body}>
        <span className="t-fig-sm">{formatCurrency(payout.amount)}</span>
        <div className={styles.note}>{payout.arrivesNote}</div>
        <div
          className={styles.bar}
          role="progressbar"
          aria-valuenow={payout.batchedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Batching progress"
        >
          <i style={{ width: `${payout.batchedPercent}%` }} />
        </div>
        <div className={styles.barMeta}>
          <span>
            {payout.account.label}{" "}
            <span className={styles.fig}>{payout.account.figure}</span>
          </span>
          <span>{payout.batchedPercent}% batched</span>
        </div>
        <a className={styles.ghostBtn} href="#">
          Payout schedule
          <span className={styles.ghostArrow} aria-hidden="true">
            <IconCtaArrow />
          </span>
        </a>
      </div>
    </section>
  );
}
