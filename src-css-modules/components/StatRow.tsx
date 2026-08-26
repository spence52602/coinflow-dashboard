import type { StatSummary } from "@/data/types";
import { IconArrowUpRight } from "./icons";
import styles from "./StatRow.module.css";

interface StatRowProps {
  stats: StatSummary[];
}

/** Smooth sparkline path from a series (base design's easing kept). */
function sparkPath(vals: number[], w: number, h: number, pad: number): string {
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const n = vals.length;
  const xy = (i: number, v: number): [number, number] => [
    i * (w / (n - 1)),
    pad + (h - pad * 2) * (1 - (v - lo) / (hi - lo || 1)),
  ];
  let d = "";
  let prev: [number, number] | null = null;
  vals.forEach((v, i) => {
    const [x, y] = xy(i, v);
    if (i === 0) {
      d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    } else if (prev) {
      const cx = (prev[0] + x) / 2;
      d += ` C${cx.toFixed(1)},${prev[1].toFixed(1)} ${cx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }
    prev = [x, y];
  });
  return d;
}

export function StatRow({ stats }: StatRowProps) {
  return (
    <section className={styles.card} aria-label="Key metrics">
      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.key} className={styles.stat}>
            <div className={styles.statHead}>
              <span className="t-label" style={{ color: "var(--muted)" }}>
                {stat.label}
              </span>
              <span className={styles.statArrow} aria-hidden="true">
                <IconArrowUpRight />
              </span>
            </div>
            <div className={styles.row}>
              <span className="t-fig-sm">{stat.value}</span>
              <svg
                className={styles.spark}
                viewBox="0 0 92 26"
                aria-hidden="true"
              >
                <path
                  d={sparkPath(stat.spark, 90, 26, 5)}
                  stroke="rgba(0,0,0,.55)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={styles.note}>{stat.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
