/**
 * Covers the sparkline geometry. The assertions target the properties that
 * matter visually — the curve starts at x=0, ends at the full width, stays
 * inside the padded box — rather than pinning exact path strings, which would
 * break on any easing tweak without indicating a real regression.
 */
import { describe, it, expect } from "vitest";
import { sparkPath } from "./spark";

/** Pull every coordinate pair out of a path so we can assert on bounds. */
function coords(d: string): Array<[number, number]> {
  return [...d.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]);
}

describe("sparkPath", () => {
  it("starts with a moveto at x=0", () => {
    expect(sparkPath([1, 2, 3], 90, 26, 5)).toMatch(/^M0\.0,/);
  });

  it("ends at the full width", () => {
    const xs = coords(sparkPath([1, 5, 2, 8], 90, 26, 5)).map(([x]) => x);
    expect(Math.max(...xs)).toBeCloseTo(90, 1);
  });

  it("keeps every point inside the padded box", () => {
    const ys = coords(sparkPath([3, 9, 1, 7, 4], 90, 26, 5)).map(([, y]) => y);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(5);
    expect(Math.max(...ys)).toBeLessThanOrEqual(21); // h - pad
  });

  it("emits one cubic segment per gap between points", () => {
    const d = sparkPath([1, 2, 3, 4], 90, 26, 5);
    expect((d.match(/C/g) ?? []).length).toBe(3);
  });

  it("puts the highest value at the top of the box", () => {
    const pts = coords(sparkPath([1, 10, 1], 90, 26, 5));
    const peak = pts.reduce((a, b) => (b[1] < a[1] ? b : a));
    expect(peak[1]).toBeCloseTo(5, 1); // pad
  });

  it("draws a flat series as a straight line instead of dividing by zero", () => {
    const d = sparkPath([4, 4, 4], 90, 26, 5);
    expect(d).not.toContain("NaN");
    const ys = coords(d).map(([, y]) => y);
    expect(new Set(ys).size).toBe(1);
  });
});
