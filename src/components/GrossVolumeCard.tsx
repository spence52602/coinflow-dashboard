"use client";

/**
 * Gross-volume card: headline figure, range toggle, and the bar chart.
 *
 * The plot is hand-laid rather than drawn by a chart library. Every constant
 * in PLOT is measured off the Figma frame — bar pitch, run-in, gridline
 * spacing, the dollars-per-pixel scale — and a charting library would
 * override exactly those values in favor of its own layout engine.
 *
 * What the range control does lives in lib/volume-range.ts: which days a range
 * covers, whether they're drawn as days, weeks or months, what the axis reads,
 * and which figures go above the chart. This file draws the answer and handles
 * pointing at it.
 */

import * as React from "react";
import type { Period, VolumeRange, VolumeSummary } from "@/data/types";
import { formatAxisValue, formatCurrency } from "@/data/format";
import {
  PLOT_SCALE,
  buildRangeView,
  chartScale,
  type Granularity,
  type VolumeBucket,
} from "@/lib/volume-range";
import { cn } from "@/lib/utils";
import { IconArrowUp, IconChevronWide, IconFilter } from "./icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowUpRight, Copy, Download } from "lucide-react";
import { copyText, downloadSeriesCsv, volumeSummaryText } from "@/lib/export";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GrossVolumeCardProps {
  volume: VolumeSummary;
  period: Period;
  /** The range the summary endpoint's figures describe. */
  initialRange: VolumeRange;
}

const ranges: VolumeRange[] = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

const grainWord: Record<Granularity, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
};

/*
 * Chart geometry — native coordinates of the redesigned card (Figma node
 * 152:2804, drawn at 716×297; the plot area spans y 140…277.6). The SVG
 * scales to the card width, so these constants are used verbatim. The
 * 30-bar layout is the comp's own; other range views distribute n bars
 * across the same plot span at the same slot-fill ratio. Vertical geometry
 * lives in PLOT_SCALE, next to the axis math that depends on it.
 */
const PLOT = {
  viewH: 137.7,
  runIn: 58.14, // first bar's left edge
  slot: 21.4186, // bar pitch (30-day layout)
  barW: 13.77,
  gridX0: 54.312,
  gridX1: 696.876,
  fade: { x: 59, y: 228.8, w: 634, h: 36 },
  axisX: 41.4, // right edge of the y-axis labels (measured)
  axisFont: 8,
  tickBaseline: 277.6,
};

/**
 * 30 bars = the comp's exact layout, frozen. Every other range distributes
 * slots across the same plot span but caps bar width (a lone day must read as
 * a day's bar, not a wall), centers bars in their slots, thins the ticks to
 * what fits, and shrinks the ground wash to the populated span.
 */
function layoutFor(n: number) {
  if (n === 30) {
    return {
      slot: PLOT.slot,
      barW: PLOT.barW,
      offset: 0,
      tickEvery: 7,
      fade: PLOT.fade,
    };
  }
  const slot = (PLOT.gridX1 - PLOT.runIn) / n;
  const barW = Math.min(slot * (PLOT.barW / PLOT.slot), 34);
  return {
    slot,
    barW,
    offset: (slot - barW) / 2,
    tickEvery: n <= 10 ? 1 : Math.ceil(n / 5),
    fade: { x: PLOT.runIn, y: PLOT.fade.y, w: n * slot, h: PLOT.fade.h },
  };
}

/**
 * Tallest the readout gets, in its own units. Used to stop it climbing out of
 * the plot on a bar that nearly fills the frame — past this point it pins to
 * the top of the plot and sits over the bar it describes.
 */
const READOUT_CLEARANCE = "3.9rem";

export function GrossVolumeCard({
  volume,
  period,
  initialRange,
}: GrossVolumeCardProps) {
  const [range, setRange] = React.useState<VolumeRange>(initialRange);
  const [active, setActive] = React.useState<number | null>(null);

  const view = React.useMemo(
    () =>
      buildRangeView(volume.series, range, {
        range: initialRange,
        total: volume.total,
        delta: volume.delta,
        periodLabel: period.label,
      }),
    [volume, period.label, range, initialRange],
  );

  const { buckets } = view;
  const { slot, barW, offset, tickEvery, fade } = layoutFor(buckets.length);
  const scale = React.useMemo(
    () => chartScale(Math.max(...buckets.map((b) => b.amount))),
    [buckets],
  );

  const yFor = React.useCallback(
    (amount: number) => PLOT_SCALE.baseline - amount / scale.dollarsPerPx,
    [scale],
  );
  const centerOf = (i: number) => PLOT.runIn + i * slot + offset + barW / 2;

  const chartLabel = `${grainWord[view.granularity]} gross volume, ${view.periodLabel}`;
  const hovered = active === null ? null : buckets[active];

  /* Pointer lands on the nearest slot rather than only on the bar itself —
     a 13px-wide bar is a small target, and the gaps between them are dead
     space that should still answer. */
  function pointTo(clientX: number, box: DOMRect) {
    const x = ((clientX - box.left) / box.width) * 716;
    const i = Math.floor((x - PLOT.runIn) / slot);
    setActive(Math.max(0, Math.min(buckets.length - 1, i)));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = buckets.length - 1;
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (step !== 0) {
      e.preventDefault();
      /* Arrowing in from nothing starts at the most recent bar — the one a
         merchant opening this card is looking for. */
      setActive((i) => (i === null ? last : Math.max(0, Math.min(last, i + step))));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(last);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  }

  return (
    <section
      className="relative flex h-[24.28rem] flex-col overflow-hidden border-[0.0625rem] border-rule bg-paper px-[1.60625rem] pt-[1.4125rem] max-lg:h-auto max-lg:pb-4"
      aria-label="Gross volume"
    >
      <div className="flex h-[1.125rem] items-center justify-between max-lg:h-auto max-lg:flex-wrap max-lg:gap-2">
        <span className="flex items-center gap-[0.3125rem] text-xs font-medium uppercase leading-[1.5] tracking-[0.04em] text-muted">
          Gross volume
          <span
            className="-mb-[0.0625rem] block h-[0.975rem] w-[0.975rem] text-icon-chevron"
            aria-hidden="true"
          >
            <IconChevronWide />
          </span>
        </span>
        <div className="mt-1.5 flex items-center gap-[2.28rem] max-lg:gap-3 max-[519px]:w-full max-[519px]:overflow-x-auto">
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => {
              if (!v) return;
              setRange(v as VolumeRange);
              setActive(null);
            }}
            aria-label="Range"
          >
            {ranges.map((r) => (
              <ToggleGroupItem key={r} value={r} variant="segment">
                {r}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="-mr-[0.93rem] flex h-[1.625rem] w-[1.625rem] items-center justify-center p-0 max-lg:mr-0"
              aria-label="Chart options"
            >
              <span
                className="block h-[1.05rem] w-[1.05rem] text-icon-chevron"
                aria-hidden="true"
              >
                <IconFilter />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Gross volume</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => downloadSeriesCsv(view.days, view.periodLabel)}
              >
                <Download className="h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true" />
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void copyText(
                    volumeSummaryText({
                      periodLabel: view.periodLabel,
                      total: view.total,
                      delta: view.delta,
                    }),
                  );
                }}
              >
                <Copy className="h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true" />
                Copy summary
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ArrowUpRight className="h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true" />
                Open in Reports
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="-ml-[0.377rem] mt-7">
        <span className="t-fig-hero">{formatCurrency(view.total)}</span>
      </div>

      <div className="mt-[0.873rem] flex items-center gap-4 text-[0.86rem] leading-[1.5]">
        {view.delta ? (
          <>
            <span className="inline-flex items-center gap-1 text-delta-strong">
              <span
                className={cn(
                  "block h-[0.86rem] w-[0.86rem]",
                  view.delta.direction === "down" && "rotate-180",
                )}
                aria-hidden="true"
              >
                <IconArrowUp />
              </span>
              <span className="visually-hidden">
                {view.delta.direction === "down" ? "Down" : "Up"}{" "}
              </span>
              <span className="font-serif text-[0.86rem] font-bold tracking-normal tabular-nums">
                {formatCurrency(view.delta.amount)} ({view.delta.percent}%)
              </span>
            </span>
            <span className="text-[0.79rem] text-seg-idle">
              vs.{" "}
              <span className="font-serif text-[0.86rem] tabular-nums">
                {view.delta.comparedTo}
              </span>
            </span>
          </>
        ) : (
          /* ALL has no prior period to compare with; the span it covers is
             the more useful thing to say in that line. */
          <span className="text-[0.79rem] text-seg-idle">
            All time ·{" "}
            <span className="font-serif text-[0.86rem] tabular-nums">
              {view.periodLabel}
            </span>
          </span>
        )}
      </div>

      {/* Below lg the plot scrolls sideways; the padding gives the scrollbar its
          own lane instead of letting it sit on top of the date ticks. */}
      <div className="-mx-[1.60625rem] mt-[1.625rem] max-lg:overflow-x-auto max-lg:pb-4">
        <div
          className="relative outline-offset-[-2px] max-lg:min-w-[40rem]"
          tabIndex={0}
          role="img"
          aria-label={chartLabel}
          onPointerMove={(e) => pointTo(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
        >
          <svg
            className="block h-auto w-full overflow-visible"
            viewBox={`0 ${PLOT_SCALE.viewTop} 716 ${PLOT.viewH}`}
            aria-hidden="true"
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
                <stop stopColor="var(--paper)" stopOpacity="0" />
                <stop
                  offset="1"
                  stopColor="var(--bar-weekday)"
                  stopOpacity="0.5"
                />
              </linearGradient>
            </defs>

            {/* The comp draws this gradient rect beneath the bars (Rectangle 34)
                — kept in the same z-position for fidelity. */}
            <rect
              x={fade.x}
              y={fade.y}
              width={fade.w}
              height={fade.h}
              fill="url(#gv-fade)"
            />

            {scale.gridlines.map((value) => (
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

            {/* Column wash marks the slot being read — at eight bars the
                pointer can sit a long way from the bar it selected. */}
            {active !== null && (
              <rect
                x={PLOT.runIn + active * slot}
                y={PLOT_SCALE.viewTop}
                width={slot}
                height={PLOT_SCALE.baseline - PLOT_SCALE.viewTop}
                fill="var(--chart-grid)"
              />
            )}

            <g key={range} className="chart-in">
              {buckets.map((bucket, i) => {
                const top = yFor(bucket.amount);
                return (
                  <rect
                    key={bucket.key}
                    x={PLOT.runIn + i * slot + offset}
                    y={top}
                    width={barW}
                    height={PLOT_SCALE.baseline - top}
                    fill={barFill(bucket, i === active)}
                  />
                );
              })}
            </g>

            <line
              x1={PLOT.gridX0}
              x2={PLOT.gridX1}
              y1={PLOT_SCALE.baseline}
              y2={PLOT_SCALE.baseline}
              stroke="var(--chart-baseline)"
              strokeWidth={0.7655}
            />

            <g
              fill="var(--chart-axis)"
              fontFamily="var(--serif)"
              fontSize={PLOT.axisFont}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {scale.gridlines.map((value) => (
                <text
                  key={value}
                  x={PLOT.axisX}
                  y={yFor(value) + 2.6}
                  textAnchor="end"
                >
                  {formatAxisValue(value)}
                </text>
              ))}
              {buckets.map((bucket, i) =>
                i % tickEvery === 0 ? (
                  <text
                    key={bucket.key}
                    x={centerOf(i)}
                    y={PLOT.tickBaseline}
                    textAnchor="middle"
                  >
                    {bucket.tick}
                  </text>
                ) : null,
              )}
            </g>
          </svg>

          {hovered && active !== null && (
            <Readout
              bucket={hovered}
              xPercent={(centerOf(active) / 716) * 100}
              topPercent={
                ((yFor(hovered.amount) - PLOT_SCALE.viewTop) / PLOT.viewH) * 100
              }
            />
          )}
        </div>
      </div>

      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {hovered ? readoutText(hovered) : ""}
      </span>
    </section>
  );
}

/** Weekends carry the comp's lighter tone; so does a bucket still filling. */
function barFill(bucket: VolumeBucket, isActive: boolean): string {
  if (isActive) return "var(--ink)";
  return bucket.weekend || bucket.partial
    ? "var(--bar-weekend)"
    : "var(--bar-weekday)";
}

function readoutText(bucket: VolumeBucket): string {
  const period = bucket.partial ? `${bucket.label}, to date` : bucket.label;
  return `${period}: ${formatCurrency(bucket.amount)}`;
}

/**
 * The floating figure for the bar under the pointer. It rides the bar's x
 * through the middle of the plot and tucks against the near edge at either
 * end, which keeps it inside the card without measuring its own width.
 */
function Readout({
  bucket,
  xPercent,
  topPercent,
}: {
  bucket: VolumeBucket;
  xPercent: number;
  topPercent: number;
}) {
  const edge = xPercent < 18 ? "start" : xPercent > 82 ? "end" : "center";

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 whitespace-nowrap rounded-frame border-[0.0625rem] border-rule bg-paper px-[0.5rem] py-[0.34rem]",
        edge === "center" && "-translate-x-1/2",
      )}
      style={{
        left: edge === "end" ? undefined : edge === "start" ? "0.5rem" : `${xPercent}%`,
        right: edge === "end" ? "0.5rem" : undefined,
        bottom: `min(calc(${(100 - topPercent).toFixed(3)}% + 0.4rem), calc(100% - ${READOUT_CLEARANCE}))`,
      }}
    >
      <span className="block font-sans text-[0.6875rem] font-medium leading-[1.4] text-muted">
        {bucket.label}
        {bucket.partial && " · to date"}
      </span>
      <span className="block font-serif text-[0.8125rem] font-bold leading-[1.35] tabular-nums text-ink">
        {formatCurrency(bucket.amount)}
      </span>
    </div>
  );
}
