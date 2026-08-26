/**
 * Covers the formatting helpers that every number on the dashboard passes
 * through. These are the functions where a silent change (a dropped decimal, a
 * timezone slip) would be visible to a merchant but invisible in review.
 */
import { describe, it, expect } from "vitest";
import {
  formatAxisValue,
  formatCurrency,
  formatDateRange,
  formatDayLabel,
  formatInt,
  formatMonthLabel,
  formatMonthTick,
  formatTick,
} from "./format";

describe("formatCurrency", () => {
  it("always prints two decimals", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(1000.5)).toBe("$1,000.50");
  });

  it("groups thousands", () => {
    expect(formatCurrency(1234567.89)).toBe("$1,234,567.89");
  });

  it("renders zero and negatives without losing the symbol", () => {
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(-42.5)).toBe("-$42.50");
  });

  it("rounds to the cent rather than truncating", () => {
    expect(formatCurrency(0.005)).toBe("$0.01");
  });
});

describe("formatInt", () => {
  it("groups thousands and keeps integers bare", () => {
    expect(formatInt(1234567)).toBe("1,234,567");
    expect(formatInt(0)).toBe("0");
  });
});

describe("formatAxisValue", () => {
  it("renders the comp's thousand-scale axis", () => {
    expect(formatAxisValue(40_000)).toBe("$40K");
    expect(formatAxisValue(120_000)).toBe("$120K");
    expect(formatAxisValue(0)).toBe("$0K");
  });

  it("switches to millions before the label gets long", () => {
    expect(formatAxisValue(600_000)).toBe("$600K");
    expect(formatAxisValue(1_000_000)).toBe("$1M");
    expect(formatAxisValue(2_500_000)).toBe("$2.5M");
  });

  it("keeps at most one decimal", () => {
    expect(formatAxisValue(1_234_567)).toBe("$1.2M");
    expect(formatAxisValue(120_499)).toBe("$120.5K");
  });
});

describe("formatTick", () => {
  it("renders an ISO date as a chart tick", () => {
    expect(formatTick("2026-07-27")).toBe("27 Jul");
  });

  it("does not slip a day in timezones behind UTC", () => {
    // The helper appends T00:00:00 precisely so the date is parsed as local
    // time. Parsing bare "2026-01-01" would be UTC midnight, which is still
    // Dec 31 anywhere west of Greenwich.
    expect(formatTick("2026-01-01")).toBe("1 Jan");
    expect(formatTick("2026-12-31")).toBe("31 Dec");
  });

  it("covers every month boundary", () => {
    expect(formatTick("2026-02-28")).toBe("28 Feb");
    expect(formatTick("2026-11-30")).toBe("30 Nov");
  });
});

describe("formatDayLabel", () => {
  it("names the weekday so a lone bar still says which day it is", () => {
    expect(formatDayLabel("2026-08-25")).toBe("Tue, 25 Aug");
    expect(formatDayLabel("2026-08-22")).toBe("Sat, 22 Aug");
  });
});

describe("month labels", () => {
  it("always carries the year on a tick — an 18-month axis repeats months", () => {
    expect(formatMonthTick("2025-03-01")).toBe("Mar ’25");
    expect(formatMonthTick("2026-03-01")).toBe("Mar ’26");
  });

  it("spells the month out in the readout", () => {
    expect(formatMonthLabel("2026-08-01")).toBe("August 2026");
  });
});

describe("formatDateRange", () => {
  const anchor = 2026;

  it("matches the comp's period style", () => {
    expect(formatDateRange("2026-07-26", "2026-08-25", anchor)).toBe("26 Jul – 25 Aug");
  });

  it("names a shared month once", () => {
    expect(formatDateRange("2026-08-12", "2026-08-18", anchor)).toBe("12 – 18 Aug");
  });

  it("adds the year only when it is not the reporting year", () => {
    expect(formatDateRange("2025-01-01", "2025-08-25", anchor)).toBe("1 Jan – 25 Aug 2025");
    expect(formatDateRange("2025-03-01", "2026-08-25", anchor)).toBe("1 Mar 2025 – 25 Aug 2026");
  });

  it("collapses a single day", () => {
    expect(formatDateRange("2026-08-24", "2026-08-24", anchor)).toBe("24 Aug");
    expect(formatDateRange("2025-08-24", "2025-08-24", anchor)).toBe("24 Aug 2025");
  });
});
