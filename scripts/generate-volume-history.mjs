/**
 * Generates `src/data/volume-history.json` — the daily gross-volume rows that
 * precede the comp-derived month in `volume-series.json`.
 *
 * Why this exists: the Figma frame only ever showed 30 days, so the mock only
 * carried 30 days, so 3M / YTD / ALL had nothing to draw. The chart needs a
 * history behind the comp's month. That history is *generated* rather than
 * hand-written, and generated deterministically (fixed seed, no clock, no
 * Math.random) so the file can be rebuilt byte-identical:
 *
 *     node scripts/generate-volume-history.mjs
 *
 * The model is fitted to the comp's own month so the two join without a seam:
 * weekday mean $105,093 (cv 7.2%), weekend mean $66,109 (cv 15.6%), weekend
 * running 0.629 of weekday. History covers the merchant's first processing day
 * through the day before the comp series starts.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "src", "data", "volume-history.json");

/** First day the merchant processed; ALL starts here. */
const START = "2025-03-01";
/** Last day of history — the comp series picks up on 2026-07-27. */
const END = "2026-07-26";

/* Weekday baseline at each end of the history. START is where the merchant
   began; END lands on the comp's opening week (weekday mean $98,882) so the
   generated month and the comp month meet without a step. */
const BASE_START = 44_000;
const BASE_END = 98_900;
/** Growth reads as compounding rather than linear. */
const TREND_EXP = 1.35;

const WEEKEND_RATIO = 0.629;
const CV_WEEKDAY = 0.072;
const CV_WEEKEND = 0.156;

/** Seasonality by calendar month (0 = Jan) — holiday peak, new-year trough. */
const SEASON = [0.9, 0.94, 0.99, 1.0, 1.01, 1.0, 0.98, 1.0, 1.02, 1.05, 1.12, 1.18];
/** Merchants settle a little heavier in the last days of a month. */
const MONTH_END_LIFT = 1.04;

/* ---- deterministic randomness ---- */
function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const rnd = lcg(20260825);
/** Box–Muller, clamped so no single day reads as a data error. */
function gauss() {
  const u1 = Math.max(rnd(), 1e-9);
  const u2 = rnd();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(-2.2, Math.min(2.2, z));
}

/* ---- dates (UTC throughout; ISO strings in, ISO strings out) ---- */
const day = (iso) => new Date(`${iso}T00:00:00Z`);
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86_400_000);

const from = day(START);
const to = day(END);
const total = Math.round((to - from) / 86_400_000) + 1;

const rows = [];
for (let i = 0; i < total; i++) {
  const d = addDays(from, i);
  const dow = d.getUTCDay();
  const weekend = dow === 0 || dow === 6;

  const t = i / (total - 1);
  const base = BASE_START + (BASE_END - BASE_START) * Math.pow(t, TREND_EXP);

  const season = SEASON[d.getUTCMonth()];
  const monthEnd = d.getUTCDate() >= 26 ? MONTH_END_LIFT : 1;
  const shape = weekend ? WEEKEND_RATIO : 1;
  const noise = 1 + gauss() * (weekend ? CV_WEEKEND : CV_WEEKDAY);

  const amount = base * season * monthEnd * shape * noise;
  rows.push({ date: iso(d), amount: Math.round(amount * 100) / 100, weekend });
}

/* One row per line: diffable, and short enough to read. */
const body = rows
  .map((r) => `{ "date": "${r.date}", "amount": ${r.amount}, "weekend": ${r.weekend} }`)
  .join(",\n");
writeFileSync(OUT, `[\n${body}\n]\n`);

const sum = rows.reduce((a, r) => a + r.amount, 0);
console.log(`${rows.length} days ${START} → ${END}, total $${sum.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
console.log(`wrote ${OUT}`);
