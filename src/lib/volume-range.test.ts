/**
 * The range control is the one place on this dashboard where a merchant can
 * ask a question and get a wrong answer without anything looking broken — a
 * window off by a day, a total summed over the wrong bucket, an axis that
 * silently rescales the comp's frozen month. These cover exactly that.
 */
import { describe, it, expect } from "vitest";
import { getDashboardData } from "@/data/dashboard";
import {
  PLOT_SCALE,
  buildRangeView,
  chartScale,
  type Granularity,
} from "./volume-range";
import type { VolumeRange } from "@/data/types";

const data = getDashboardData();
const series = data.volume.series;
const reported = {
  range: data.activeRange,
  total: data.volume.total,
  delta: data.volume.delta,
  periodLabel: data.period.label,
};
const view = (range: VolumeRange) => buildRangeView(series, range, reported);

describe("chartScale", () => {
  it("reproduces the comp's own axis from the comp's own month", () => {
    /* The whole point of the nice-number ladder including 4. If this drifts,
       every bar in the frozen 1M view moves. */
    const compMax = Math.max(...series.slice(-30).map((p) => p.amount));
    const scale = chartScale(compMax);
    expect(scale.gridlines).toEqual([40_000, 80_000, 120_000]);
    expect(scale.dollarsPerPx).toBeCloseTo(1105.99, 2);
  });

  it("never scales so tight that a bar overruns the plot", () => {
    const ceiling = PLOT_SCALE.baseline - PLOT_SCALE.viewTop;
    for (const range of ["1D", "1W", "1M", "3M", "YTD", "ALL"] as VolumeRange[]) {
      const v = view(range);
      const max = Math.max(...v.buckets.map((b) => b.amount));
      const scale = chartScale(max);
      expect(max / scale.dollarsPerPx).toBeLessThanOrEqual(ceiling);
    }
  });

  it("climbs into millions for aggregated ranges", () => {
    expect(chartScale(2_690_000).gridlines).toEqual([1e6, 2e6, 3e6]);
  });
});

describe("buildRangeView windows", () => {
  const cases: Array<[VolumeRange, number, Granularity]> = [
    ["1D", 1, "day"],
    ["1W", 7, "day"],
    ["1M", 30, "day"],
    ["3M", 13, "week"],
    ["YTD", 8, "month"],
    ["ALL", 18, "month"],
  ];

  it.each(cases)("%s draws %i %s buckets", (range, count, granularity) => {
    const v = view(range);
    expect(v.granularity).toBe(granularity);
    expect(v.buckets).toHaveLength(count);
  });

  it("every range ends on the most recent day", () => {
    const last = series[series.length - 1].date;
    for (const [range] of cases) expect(view(range).to).toBe(last);
  });

  it("3M is thirteen whole weeks, so no stub bar", () => {
    const v = view("3M");
    expect(v.days).toHaveLength(91);
    expect(v.buckets.every((b) => b.dayCount === 7)).toBe(true);
  });

  it("YTD starts on 1 January and ALL on the first day traded", () => {
    expect(view("YTD").from).toBe("2026-01-01");
    expect(view("ALL").from).toBe(series[0].date);
  });

  it("marks the month still being filled, and only that one", () => {
    const partial = view("ALL").buckets.filter((b) => b.partial);
    expect(partial.map((b) => b.key)).toEqual(["2026-08"]);
  });
});

describe("buildRangeView totals", () => {
  it("prints the reported figures verbatim for the reported range", () => {
    const v = view("1M");
    expect(v.total).toBe(data.volume.total);
    expect(v.delta).toEqual(data.volume.delta);
    expect(v.periodLabel).toBe(data.period.label);
    /* Deliberately not the sum of the bars: summary and timeseries are
       separate endpoints and the comp's own numbers don't reconcile. */
    expect(v.total).not.toBeCloseTo(
      v.days.reduce((a, p) => a + p.amount, 0),
      0,
    );
  });

  it("computes every other range from the days it drew", () => {
    for (const range of ["1D", "1W", "3M", "YTD", "ALL"] as VolumeRange[]) {
      const v = view(range);
      const fromDays = v.days.reduce((a, p) => a + p.amount, 0);
      const fromBars = v.buckets.reduce((a, b) => a + b.amount, 0);
      expect(v.total).toBeCloseTo(fromDays, 6);
      expect(fromBars).toBeCloseTo(fromDays, 6);
    }
  });
});

describe("buildRangeView deltas", () => {
  it("compares a trailing range with the window right before it", () => {
    const v = view("1W");
    expect(v.delta?.comparedTo).toBe("12 – 18 Aug");
  });

  it("compares YTD with the same span a year earlier", () => {
    expect(view("YTD").delta?.comparedTo).toBe("1 Jan – 25 Aug 2025");
  });

  it("leaves ALL without a comparison — nothing precedes it", () => {
    expect(view("ALL").delta).toBeNull();
  });

  it("reports direction and magnitude separately", () => {
    const v = view("3M");
    expect(v.delta).not.toBeNull();
    expect(v.delta!.amount).toBeGreaterThan(0);
    expect(["up", "down"]).toContain(v.delta!.direction);
  });
});

describe("an account younger than the range", () => {
  /* A merchant three weeks into processing still clicks 3M. The window has to
     clamp to the day they started rather than inventing history behind it. */
  const young = series.slice(-40);
  const youngView = buildRangeView(young, "3M", {
    ...reported,
    range: "1M",
  });

  it("clamps the window to the first day traded", () => {
    expect(youngView.from).toBe(young[0].date);
    expect(youngView.days).toHaveLength(40);
  });

  it("marks the short trailing week rather than drawing it as a full one", () => {
    const last = youngView.buckets[youngView.buckets.length - 1];
    expect(youngView.buckets).toHaveLength(6);
    expect(last.dayCount).toBe(5);
    expect(last.partial).toBe(true);
  });

  it("still finds nothing to compare against and says so", () => {
    expect(buildRangeView(young, "ALL", reported).delta).toBeNull();
  });
});

describe("a period that took nothing", () => {
  it("reports the change without dividing by zero", () => {
    const flat = [
      { date: "2026-08-23", amount: 0, weekend: true },
      { date: "2026-08-24", amount: 500, weekend: false },
    ];
    const v = buildRangeView(flat, "1D", { ...reported, range: "1M" });
    expect(v.delta).toEqual({
      amount: 500,
      percent: 0,
      direction: "up",
      comparedTo: "23 Aug",
    });
  });
});

describe("determinism", () => {
  it("does not read the clock — the same call twice is the same view", () => {
    expect(JSON.stringify(view("ALL"))).toBe(JSON.stringify(view("ALL")));
  });
});
