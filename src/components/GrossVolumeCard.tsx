"use client";

import * as React from "react";
import type { VolumePoint, VolumeRange, VolumeSummary } from "@/data/types";
import { formatAxisK, formatCurrency, formatTick } from "@/data/format";
import { IconArrowUp, IconChevronWide, IconFilter } from "./icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  initialRange: VolumeRange;
}

const ranges: VolumeRange[] = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

/** Days of the series each range shows (the mock carries one month). */
const rangeDays: Record<VolumeRange, number> = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "3M": 30,
  YTD: 30,
  ALL: 30,
};

/*
 * Chart geometry — native coordinates of the redesigned card (Figma node
 * 152:2804, drawn at 716×297; the plot area spans y 140…277.6). The SVG
 * scales to the card width, so these constants are used verbatim. The
 * 30-bar layout is the comp's own; other range views distribute n bars
 * across the same plot span at the same slot-fill ratio.
 */
const PLOT = {
  viewTop: 140,
  viewH: 137.7,
  runIn: 58.14, // first bar's left edge
  slot: 21.4186, // bar pitch (30-day layout)
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

/** 30 bars = the comp's exact layout; other counts share span and fill ratio. */
function layoutFor(n: number) {
  if (n === 30) {
    return { slot: PLOT.slot, barW: PLOT.barW, tickEvery: 7 };
  }
  const slot = (PLOT.gridX1 - PLOT.runIn) / n;
  return {
    slot,
    barW: slot * (PLOT.barW / PLOT.slot),
    tickEvery: Math.max(1, Math.ceil(n / 5)),
  };
}

export function GrossVolumeCard({ volume, initialRange }: GrossVolumeCardProps) {
  const [range, setRange] = React.useState<VolumeRange>(initialRange);
  const series: VolumePoint[] = React.useMemo(
    () => volume.series.slice(-rangeDays[range]),
    [volume.series, range],
  );
  const { slot, barW, tickEvery } = layoutFor(series.length);

  const chartLabel =
    series.length > 0
      ? `Daily gross volume, ${formatTick(series[0].date)} to ${formatTick(series[series.length - 1].date)}`
      : "Daily gross volume";

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
              if (v) setRange(v as VolumeRange);
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
              <DropdownMenuLabel>Chart</DropdownMenuLabel>
              <DropdownMenuItem>Export chart data</DropdownMenuItem>
              <DropdownMenuItem>View in Reports</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Chart settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="-ml-[0.377rem] mt-7">
        <span className="t-fig-hero">{formatCurrency(volume.total)}</span>
      </div>

      <div className="mt-[0.873rem] flex items-center gap-4 text-[0.86rem] leading-[1.5]">
        <span className="inline-flex items-center gap-1 text-delta-strong">
          <span className="block h-[0.86rem] w-[0.86rem]" aria-hidden="true">
            <IconArrowUp />
          </span>
          <span className="font-serif text-[0.86rem] font-bold tracking-normal tabular-nums">
            {formatCurrency(volume.delta.amount)} ({volume.delta.percent}%)
          </span>
        </span>
        <span className="text-[0.79rem] text-seg-idle">
          vs.{" "}
          <span className="font-serif text-[0.86rem] tabular-nums">
            {volume.delta.comparedTo}
          </span>
        </span>
      </div>

      <div className="-mx-[1.60625rem] mt-[1.625rem] max-lg:overflow-x-auto">
        <svg
          className="block h-auto w-full overflow-visible max-lg:min-w-[40rem]"
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
                x={PLOT.runIn + i * slot}
                y={top}
                width={barW}
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
              i % tickEvery === 0 ? (
                <text
                  key={point.date}
                  x={PLOT.runIn + i * slot + barW / 2}
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
    </section>
  );
}
