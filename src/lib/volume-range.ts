/**
 * Turns the daily gross-volume series into whatever the selected range needs
 * to draw: a window of days, the bars for that window, the y-axis behind them,
 * and the headline figures above them.
 *
 * Three rules shape everything here.
 *
 * 1. **Bars are readable, not literal.** 543 daily bars in a 716-unit plot is a
 *    smear. Long ranges aggregate — 3M into whole weeks, YTD and ALL into
 *    calendar months — so a bar is always something a merchant can point at.
 * 2. **The axis follows the data.** A monthly bar is ~25× a daily one, so the
 *    comp's fixed $40K/$80K/$120K gridlines can't serve every range. `chartScale`
 *    derives them, and its "nice" ladder includes 4 precisely so that the comp's
 *    own month reproduces the comp's own axis exactly (see the test).
 * 3. **The reported period keeps its reported numbers.** The summary endpoint's
 *    total and delta are not derived from the series and the two can drift; for
 *    the range they describe we print them verbatim rather than recomputing.
 *
 * Nothing here reads the clock: "today" is the last day in the series, so the
 * server and the client always agree.
 */
import type { VolumeDelta, VolumePoint, VolumeRange } from "@/data/types";
import {
  formatDateRange,
  formatDayLabel,
  formatMonthLabel,
  formatMonthTick,
  formatTick,
} from "@/data/format";

export type Granularity = "day" | "week" | "month";

export interface VolumeBucket {
  key: string;
  /** Axis tick label. */
  tick: string;
  /** Readout heading — "Tue, 18 Aug", "13 – 19 Jul", "August 2026". */
  label: string;
  amount: number;
  /** Days covered, for the readout's second line at week/month granularity. */
  dayCount: number;
  /** Weekend day — the comp's lighter bar tone. */
  weekend: boolean;
  /** Bucket the period hasn't finished filling (the current month). */
  partial: boolean;
  from: string;
  to: string;
}

export interface ChartScale {
  /** Three gridline values, ascending. */
  gridlines: number[];
  /** Dollars per vertical plot unit. */
  dollarsPerPx: number;
}

export interface RangeView {
  range: VolumeRange;
  granularity: Granularity;
  buckets: VolumeBucket[];
  /** The underlying daily rows — what exports should carry, not the buckets. */
  days: VolumePoint[];
  total: number;
  /** "26 Jul – 25 Aug". */
  periodLabel: string;
  from: string;
  to: string;
  /** Null when nothing precedes the window (ALL has no prior period). */
  delta: VolumeDelta | null;
}

interface RangeSpec {
  /** Trailing day count, or a rule that resolves against the series. */
  days: number | "ytd" | "all";
  granularity: Granularity;
}

/*
 * 3M is 91 days rather than 90 so it divides into 13 whole weeks — a 90-day
 * window leaves a six-day stub bar that reads as missing data.
 */
const RANGE_SPEC: Record<VolumeRange, RangeSpec> = {
  "1D": { days: 1, granularity: "day" },
  "1W": { days: 7, granularity: "day" },
  "1M": { days: 30, granularity: "day" },
  "3M": { days: 91, granularity: "week" },
  YTD: { days: "ytd", granularity: "month" },
  ALL: { days: "all", granularity: "month" },
};

/* ---- ISO day arithmetic (UTC in, ISO strings out) ---- */
const MS_DAY = 86_400_000;
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const isoOf = (d: Date) => d.toISOString().slice(0, 10);
const shiftDays = (iso: string, n: number) => isoOf(new Date(utc(iso).getTime() + n * MS_DAY));
const yearOf = (iso: string) => Number(iso.slice(0, 4));
const monthKey = (iso: string) => iso.slice(0, 7);
const firstOfMonth = (iso: string) => `${monthKey(iso)}-01`;

function lastOfMonth(iso: string): string {
  const d = utc(iso);
  return isoOf(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)));
}

/** Inclusive slice of the series between two ISO days. */
function between(series: VolumePoint[], from: string, to: string): VolumePoint[] {
  return series.filter((p) => p.date >= from && p.date <= to);
}

const sum = (points: VolumePoint[]) => points.reduce((a, p) => a + p.amount, 0);

/* ---- axis ----
 * Steps climb 1 → 2 → 2.5 → 4 → 5 → 10 per decade. The 4 is not decoration:
 * the comp's axis is $40K/$80K/$120K, and without it the comp's own month
 * would snap to a $50K step and every frozen bar would move.
 */
const NICE_STEPS = [1, 2, 2.5, 4, 5, 10];

/**
 * Vertical plot geometry, measured off the comp (Figma node 152:2804, drawn at
 * 716×297). It lives beside the axis math rather than with the drawing code
 * because it *is* the scale: `gridSpan` is the rise from the zero line to the
 * top gridline, and the space above that line is headroom the comp's own tallest
 * bar runs into.
 */
export const PLOT_SCALE = {
  viewTop: 140,
  baseline: 264.468,
  /** 120_000 ÷ 1105.99 — the offset the comp draws its $120K gridline at. */
  gridSpan: 108.500077,
} as const;

/** How far above the top gridline a bar may still run, as a multiplier. */
const HEADROOM =
  (PLOT_SCALE.baseline - PLOT_SCALE.viewTop) / PLOT_SCALE.gridSpan;

export function chartScale(max: number): ChartScale {
  const needed = Math.max(max, 1) / HEADROOM / 3;
  const decade = Math.pow(10, Math.floor(Math.log10(needed)));
  const step = (NICE_STEPS.find((m) => m * decade >= needed) ?? 10) * decade;

  return {
    gridlines: [step, step * 2, step * 3],
    dollarsPerPx: (step * 3) / PLOT_SCALE.gridSpan,
  };
}

/* ---- bucketing ---- */
function bucketDays(days: VolumePoint[]): VolumeBucket[] {
  return days.map((p) => ({
    key: p.date,
    tick: formatTick(p.date),
    label: formatDayLabel(p.date),
    amount: p.amount,
    dayCount: 1,
    weekend: p.weekend,
    partial: false,
    from: p.date,
    to: p.date,
  }));
}

/** Whole weeks, counted back from the end of the window. */
function bucketWeeks(days: VolumePoint[]): VolumeBucket[] {
  const buckets: VolumeBucket[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    const from = week[0].date;
    const to = week[week.length - 1].date;
    buckets.push({
      key: from,
      tick: formatTick(from),
      label: formatDateRange(from, to, yearOf(to)),
      amount: sum(week),
      dayCount: week.length,
      weekend: false,
      partial: week.length < 7,
      from,
      to,
    });
  }
  return buckets;
}

/** Calendar months; the first and last are partial if the data doesn't fill them. */
function bucketMonths(
  days: VolumePoint[],
  seriesFirst: string,
  seriesLast: string,
): VolumeBucket[] {
  const order: string[] = [];
  const groups = new Map<string, VolumePoint[]>();
  for (const p of days) {
    const key = monthKey(p.date);
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(p);
  }

  return order.map((key) => {
    const month = groups.get(key)!;
    const from = month[0].date;
    const to = month[month.length - 1].date;
    /* Partial only where the *data* runs out, not where the window was cut:
       a month clipped by the range still happened in full. */
    const partial =
      firstOfMonth(from) < seriesFirst || lastOfMonth(to) > seriesLast;
    return {
      key,
      tick: formatMonthTick(from),
      label: formatMonthLabel(from),
      amount: sum(month),
      dayCount: month.length,
      weekend: false,
      partial,
      from,
      to,
    };
  });
}

/* ---- window ---- */
function windowFor(series: VolumePoint[], range: VolumeRange): { from: string; to: string } {
  const first = series[0].date;
  const last = series[series.length - 1].date;
  const spec = RANGE_SPEC[range];

  if (spec.days === "all") return { from: first, to: last };
  if (spec.days === "ytd") return { from: `${yearOf(last)}-01-01`, to: last };
  const from = shiftDays(last, -(spec.days - 1));
  return { from: from < first ? first : from, to: last };
}

/**
 * The window to compare against. Trailing ranges compare with the window
 * immediately before them; YTD compares with the same calendar span a year
 * earlier, which is what "year to date" means to a merchant. ALL has nothing
 * behind it.
 */
function priorWindow(
  range: VolumeRange,
  window: { from: string; to: string },
  dayCount: number,
): { from: string; to: string } | null {
  if (range === "ALL") return null;
  if (range === "YTD") {
    const y = yearOf(window.from) - 1;
    return { from: `${y}-01-01`, to: `${y}${window.to.slice(4)}` };
  }
  const to = shiftDays(window.from, -1);
  return { from: shiftDays(to, -(dayCount - 1)), to };
}

export function buildRangeView(
  series: VolumePoint[],
  range: VolumeRange,
  reported: {
    range: VolumeRange;
    total: number;
    delta: VolumeDelta;
    periodLabel: string;
  },
): RangeView {
  const seriesFirst = series[0].date;
  const seriesLast = series[series.length - 1].date;
  const anchorYear = yearOf(seriesLast);

  const window = windowFor(series, range);
  const days = between(series, window.from, window.to);
  const { granularity } = RANGE_SPEC[range];

  const buckets =
    granularity === "day"
      ? bucketDays(days)
      : granularity === "week"
        ? bucketWeeks(days)
        : bucketMonths(days, seriesFirst, seriesLast);

  /* The reported range prints the summary endpoint's own figures. */
  if (range === reported.range) {
    return {
      range,
      granularity,
      buckets,
      days,
      total: reported.total,
      periodLabel: reported.periodLabel,
      from: window.from,
      to: window.to,
      delta: reported.delta,
    };
  }

  const total = sum(days);
  const prior = priorWindow(range, window, days.length);
  const priorDays = prior ? between(series, prior.from, prior.to) : [];
  let delta: VolumeDelta | null = null;

  if (prior && priorDays.length > 0) {
    const priorTotal = sum(priorDays);
    const change = total - priorTotal;
    delta = {
      amount: Math.abs(change),
      percent: priorTotal === 0 ? 0 : Math.round((change / priorTotal) * 1000) / 10,
      direction: change < 0 ? "down" : "up",
      comparedTo: formatDateRange(prior.from, prior.to, anchorYear),
    };
  }

  return {
    range,
    granularity,
    buckets,
    days,
    total,
    periodLabel: formatDateRange(window.from, window.to, anchorYear),
    from: window.from,
    to: window.to,
    delta,
  };
}
