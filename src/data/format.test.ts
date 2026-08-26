/**
 * Covers the formatting helpers that every number on the dashboard passes
 * through. These are the functions where a silent change (a dropped decimal, a
 * timezone slip) would be visible to a merchant but invisible in review.
 */
import { describe, it, expect } from "vitest";
import { formatCurrency, formatInt, formatAxisK, formatTick } from "./format";

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

describe("formatAxisK", () => {
  it("renders whole-thousand axis labels", () => {
    expect(formatAxisK(120000)).toBe("$120K");
    expect(formatAxisK(0)).toBe("$0K");
  });

  it("rounds to the nearest thousand", () => {
    expect(formatAxisK(120499)).toBe("$120K");
    expect(formatAxisK(120500)).toBe("$121K");
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
