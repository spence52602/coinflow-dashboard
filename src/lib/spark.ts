/**
 * Sparkline geometry.
 *
 * Lives in `lib/` rather than beside the component that draws it because it is
 * pure geometry with no React in it — which also makes it the one piece of the
 * stat row that can be covered by tests directly.
 */

/**
 * Build a smooth SVG path from a series, scaled to fit a `w` x `h` box.
 *
 * Values are normalized against the series' own min/max, so the curve always
 * fills the vertical space regardless of magnitude. `pad` insets the curve top
 * and bottom so a 1.5px stroke is not clipped at the extremes.
 *
 * Segments are cubic béziers whose control points sit at the horizontal
 * midpoint between neighbours — the easing carried over from the base design.
 *
 * A flat series (every value equal) renders as a straight line at the bottom
 * of the box rather than dividing by zero.
 */
export function sparkPath(
  vals: number[],
  w: number,
  h: number,
  pad: number,
): string {
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
