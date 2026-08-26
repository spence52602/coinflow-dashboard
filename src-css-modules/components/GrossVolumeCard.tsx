import type { VolumeRange, VolumeSummary } from "@/data/types";
import { formatAxisK, formatCurrency, formatTick } from "@/data/format";
import { IconArrowUp, IconChevronWide, IconDots, IconFilter } from "./icons";
import styles from "./GrossVolumeCard.module.css";

interface GrossVolumeCardProps {
  volume: VolumeSummary;
  activeRange: VolumeRange;
}

const ranges: VolumeRange[] = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

/*
 * Chart geometry — native coordinates of the redesigned card (Figma node
 * 152:2804, drawn at 716×297; the plot area spans y 140…277.6). The SVG
 * scales to the card width, so these constants are used verbatim.
 */
const PLOT = {
  viewTop: 140,
  viewH: 137.7,
  runIn: 58.14, // first bar's left edge
  slot: 21.4186, // bar pitch
  barW: 13.77,
  baseline: 264.468,
  gridX0: 54.312,
  gridX1: 696.876,
  dollarsPerPx: 1105.99, // $40K per 36.1667px of bar height
  gridlines: [40_000, 80_000, 120_000],
  fade: { x: 59, y: 228.8, w: 634, h: 36 },
  axisX: 41.4, // right edge of the y-axis labels (measured)
  axisFont: 8,
  tickBaseline: 277.6,
};

function yFor(amount: number): number {
  return PLOT.baseline - amount / PLOT.dollarsPerPx;
}

export function GrossVolumeCard({ volume, activeRange }: GrossVolumeCardProps) {
  const { series } = volume;
  const chartLabel =
    series.length > 0
      ? `Daily gross volume, ${formatTick(series[0].date)} to ${formatTick(series[series.length - 1].date)}`
      : "Daily gross volume";

  return (
    <section className={styles.card} aria-label="Gross volume">
      <div className={styles.head}>
        <span className={styles.label}>
          Gross volume
          <span className={styles.labelChevron} aria-hidden="true">
            <IconChevronWide />
          </span>
        </span>
        <div className={styles.tools}>
          <div className={styles.seg} role="group" aria-label="Range">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                aria-pressed={range === activeRange}
                className={
                  range === activeRange
                    ? `${styles.segBtn} ${styles.segBtnActive}`
                    : styles.segBtn
                }
              >
                {range}
              </button>
            ))}
          </div>
          <button className={styles.filterBtn} type="button" aria-label="Chart options">
            <span className={styles.filterIcon} aria-hidden="true">
              <IconFilter />
            </span>
          </button>
        </div>
      </div>

      <div className={styles.figure}>
        <span className="t-fig-hero">{formatCurrency(volume.total)}</span>
      </div>

      <div className={styles.delta}>
        <span className={styles.deltaUp}>
          <span className={styles.deltaArrow} aria-hidden="true">
            <IconArrowUp />
          </span>
          <span className={styles.deltaFig}>
            {formatCurrency(volume.delta.amount)} ({volume.delta.percent}%)
          </span>
        </span>
        <span className={styles.deltaVs}>
          vs. <span className={styles.deltaVsFig}>{volume.delta.comparedTo}</span>
        </span>
      </div>

      <div className={styles.chartScroll}>
        <svg
          className={styles.chart}
          viewBox={`0 ${PLOT.viewTop} 716 ${PLOT.viewH}`}
          role="img"
          aria-label={chartLabel}
        >
        <defs>
          <linearGradient
            id="gv-fade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PLOT.fade.y}
            x2="0"
            y2={PLOT.fade.y + PLOT.fade.h}
          >
            {/* Ground wash under the bars — stops verbatim from the comp. */}
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#2B2B2B" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* The comp draws this gradient rect beneath the bars (Rectangle 34)
            — kept in the same z-position for fidelity. */}
        <rect
          x={PLOT.fade.x}
          y={PLOT.fade.y}
          width={PLOT.fade.w}
          height={PLOT.fade.h}
          fill="url(#gv-fade)"
        />

        {PLOT.gridlines.map((value) => (
          <line
            key={value}
            x1={PLOT.gridX0}
            x2={PLOT.gridX1}
            y1={yFor(value)}
            y2={yFor(value)}
            stroke="var(--chart-grid)"
            strokeWidth={0.7655}
          />
        ))}

        {series.map((point, i) => {
          const top = yFor(point.amount);
          return (
            <rect
              key={point.date}
              x={PLOT.runIn + i * PLOT.slot}
              y={top}
              width={PLOT.barW}
              height={PLOT.baseline - top}
              fill={point.weekend ? "var(--bar-weekend)" : "var(--bar-weekday)"}
            />
          );
        })}

        <line
          x1={PLOT.gridX0}
          x2={PLOT.gridX1}
          y1={PLOT.baseline}
          y2={PLOT.baseline}
          stroke="var(--chart-baseline)"
          strokeWidth={0.7655}
        />

        <g
          fill="var(--chart-axis)"
          fontFamily="var(--serif)"
          fontSize={PLOT.axisFont}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {PLOT.gridlines.map((value) => (
            <text
              key={value}
              x={PLOT.axisX}
              y={yFor(value) + 2.6}
              textAnchor="end"
            >
              {formatAxisK(value)}
            </text>
          ))}
          {series.map((point, i) =>
            i % 7 === 0 ? (
              <text
                key={point.date}
                x={PLOT.runIn + i * PLOT.slot + PLOT.barW / 2}
                y={PLOT.tickBaseline}
                textAnchor="middle"
              >
                {formatTick(point.date)}
              </text>
            ) : null,
          )}
        </g>
        </svg>
      </div>

      <button className={styles.dots} type="button" aria-label="Card menu">
        <span className={styles.dotsIcon} aria-hidden="true">
          <IconDots />
        </span>
      </button>
    </section>
  );
}
