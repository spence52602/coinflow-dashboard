import type { Attention, AttentionItem } from "@/data/types";
import {
  IconAttnAch,
  IconAttnDisputes,
  IconAttnInformation,
  IconCtaArrow,
} from "../icons";
import styles from "./NeedsAttention.module.css";

interface NeedsAttentionProps {
  attention: Attention;
}

const iconFor: Record<AttentionItem["icon"], typeof IconAttnDisputes> = {
  disputes: IconAttnDisputes,
  information: IconAttnInformation,
  ach: IconAttnAch,
};

export function NeedsAttention({ attention }: NeedsAttentionProps) {
  return (
    <section className={styles.card} aria-label="Needs attention">
      <span className={styles.label}>Needs attention</span>
      <h2 className={`${styles.title} t-title-attn`}>{attention.title}</h2>
      <ul className={styles.list}>
        {attention.items.map((item) => {
          const Icon = iconFor[item.icon];
          return (
            <li key={item.id}>
              <a className={styles.row} href="#">
                <span className={styles.rowIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.rowText}>
                  <span className={styles.rowLabel}>{item.label}</span>
                  <span className={styles.rowNote}>{item.note}</span>
                </span>
                <span className={styles.rowCount}>{item.count}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <a className={styles.cta} href="#">
        Review all
        <span className={styles.ctaArrow} aria-hidden="true">
          <IconCtaArrow />
        </span>
      </a>
    </section>
  );
}
