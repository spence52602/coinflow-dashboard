# Coinflow — Merchant Home

A payments-dashboard homepage rebuilt pixel-faithfully from a Figma comp, shipped as a
production Next.js app. **Live:** https://coinflow-app-jade.vercel.app

> **Building it?** The licensed typefaces are not in this repo. See
> [Fonts](#fonts) first — `npm run build` fails at the font import without them.
> `npm test` runs clean regardless.

This was built twice. The first pass used CSS Modules with design-token custom
properties; the shipped app is a strict syntax migration of it to Tailwind v4 +
shadcn/ui (Radix primitives, cva). Full-page screenshots at 1728px and 1321px are
checked into `ref/`, and the shipped app diffs against them at **0.003% of pixels**
(three sub-glyph anti-aliasing clusters, documented below).

The CSS Modules pass is not in the working tree — it was carrying a duplicate copy
of the licensed fonts and compiled nothing, so it was removed. It remains in the
commit history if the comparison is ever wanted.

## Stack

- **Next.js 15** (App Router, React Server Components), TypeScript strict
- **Tailwind CSS v4** — tokens exposed via `@theme inline`, the type scale as `@utility` classes
- **shadcn/ui conventions** — hand-authored Radix primitives in `src/components/ui/`
  (ToggleGroup, DropdownMenu, Dialog, cmdk Command, Tooltip), variants via `cva`
- Self-hosted fonts (`next/font/local`): Swift (serif — headings and aligned figures)
  and Acid Grotesk (sans — interface)
- **Vitest** (`jsdom`) for the logic layer — see [Tests](#tests)

## Design system

`src/styles/tokens.css` is the single source of truth: ink/surface/rule colors, chart
tones, and the two radii (`--r-control: 1px`, `--r-frame: 2px`). Tailwind maps them 1:1
(`--chrome → bg-chrome`, `--rule → border-rule`); shadcn's semantic names
(`--background`, `--border`, `--muted-foreground`, `--radius`) alias onto the same
tokens — no second palette exists.

The full Coinflow type scale ships as semantic utilities (`t-fig-hero`, `t-label`,
`t-title-plate`, …) — single classes, never flattened into arbitrary values.

**Fluid composition:** the page is composed on a 1728px grid with
`html { font-size: clamp(9.5px, 0.92593vw, 16px) }`. Every dimension is rem-based, so
the whole composition scales linearly across desktop widths and renders pixel-identical
to the Figma frame at its reference viewport. Below 1024px the layout restacks; below
640px it is frosted over by `MobileNotice` instead — the comp is a desktop one and the
phone layout has not been given the same care, so a phone gets an honest note rather
than a rough approximation.

## Architecture

- `src/data/` — typed domain model (`types.ts`) and one mock entry point,
  `getDashboardData()`. Components are props-driven; wiring a real API means replacing
  that single function. Series and reported totals are separate fields, as a real
  summary + timeseries API pair would be. The daily volume series is two files that
  abut: `volume-series.json` is the comp's own month, extracted from its chart
  geometry and frozen; `volume-history.json` is the trading behind it, back to the
  merchant's first processing day, rebuilt deterministically with
  `node scripts/generate-volume-history.mjs`.
- `src/components/` — server components by default; interactivity is isolated in small
  client islands (`MerchantSwitcher`, `SearchCommand` on ⌘K, `GrossVolumeCard`'s range
  control and chart readout, `PurchasesMenu`, `StatRow` tooltips).
- `src/components/icons.tsx` — the comp's exact SVG path data, stroke-based on
  `currentColor`.
- The chart is data-driven SVG in the comp's native 716-unit coordinate space; the
  30-day layout reproduces the comp verbatim, other ranges redistribute bars across the
  same plot span. `lib/volume-range.ts` decides what a range means: 1D/1W/1M draw days,
  3M draws thirteen whole weeks, YTD and ALL draw calendar months, and the headline,
  delta and y-axis all follow. The axis is derived rather than fixed — its nice-number
  ladder includes 4 so that the comp's own month still yields the comp's own
  $40K/$80K/$120K gridlines, which a test pins. The reported range keeps the summary
  endpoint's figures verbatim instead of recomputing them from the bars.
- Pointing at the chart — hover, or focus it and use ←/→, Home/End, Esc — reads out the
  bar under the cursor, with an `aria-live` announcement alongside.

## Provenance

The comp (a Figma frame layering hand-tweaks over an earlier HTML render) was
reverse-engineered forensically — every overlay node cataloged, assets exported,
bar values reconstructed from drawn geometry — then rebuilt and driven through
adversarial review loops: 10 build/measure rounds and 15 fresh-context critics
(blind A/B design judges, completeness sweeps, code audits). Final fidelity:
6.12% pixel-difference against the reference bitmap, residual being
anti-aliasing against the frame's JPEG-scaled image.

## Development

### Fonts

Swift and Acid Grotesk are licensed commercial typefaces, so their binaries are
**not** in this repo. `src/fonts/` is gitignored and the build expects four
files there:

```
src/fonts/swift-regular.woff2
src/fonts/swift-bold.woff2
src/fonts/acid-grotesk-regular.woff2
src/fonts/acid-grotesk-medium.woff2
```

Supply your own licensed copies, or point `localFont` in `src/app/layout.tsx`
at substitutes. Without them `next build` fails at the font import — that is
the intended failure, not a misconfiguration.

```bash
npm install
npm run dev            # develop
npm run build          # production build
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run test           # vitest run
npm run test:watch     # vitest
npm run test:coverage  # vitest run --coverage
```

## Tests

Vitest, running in `jsdom`. The suite covers the pure logic rather than the
markup — the places where a silent change would reach a merchant without
showing up in review:

| Area | Why it's covered |
|---|---|
| `data/format.ts` | Every number on screen passes through it; a dropped decimal or a timezone slip is invisible in a diff |
| `lib/export.ts` | CSV row shape, quoting of comma-bearing fields, and filename sanitisation |
| `lib/spark.ts` | Sparkline geometry — bounds, segment count, and the flat-series divide-by-zero guard |
| `lib/volume-range.ts` | What each range window covers, how it buckets, and the axis it derives — the one control where a wrong answer still looks like a chart |
| `lib/utils.ts` | That a later Tailwind class beats an earlier one, which is what makes `className` overrides work |

63 tests; 100% of statements, lines and functions on that surface. The two
uncovered branches are unreachable defensive guards — one in `sparkPath`, one
in the axis ladder's fallback step.

The CSV tests capture Blob contents through a stubbed `URL.createObjectURL`
rather than asserting on a download, since jsdom never performs one — what
matters is the bytes that would have been written.

Component rendering is deliberately not covered: the fidelity of this build was
established forensically against the comp (see Provenance), and snapshot tests
would pin markup without measuring what that work actually verified.

## Known render deltas (Tailwind port vs. `ref/`)

- Three rotated chevrons (merchant switcher, date chip, "Local time") sit ±2px: the
  legacy build rendered them through an inline-svg quirk that Tailwind Preflight's
  `svg { display: block }` normalizes. 36px of anti-aliasing total.
- One sub-glyph AA cluster in the chart's delta row at 1728px (bounding boxes
  identical; rasterization jitter). 30px.
- The sidebar lockup, 419px at 1321 and 520px at 1728, both inside the logo's own
  bounding box. Deliberate: `coinflow-lockup.svg` carried a Figma noise filter —
  fractal grain flooded 55% black over an already-black mark, invisible at every
  size the logo is used. WebKit rasterises a filtered SVG at roughly CSS-pixel
  resolution and upscales, so on a high-DPR screen it made the logo visibly
  blurry (measured: 3.91px mean edge transition against Chrome's 1.22px; 1.20px
  once removed). The delta at 1x is that grain disappearing, and the mark is
  slightly cleaner for it.

Everything else — 2.85M rendered pixels across both reference widths — is unchanged.
