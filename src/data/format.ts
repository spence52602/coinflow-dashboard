/** Formatting helpers — single source for currency/number/date rendering. */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const int = new Intl.NumberFormat("en-US");

export function formatCurrency(amount: number): string {
  return usd.format(amount);
}

export function formatInt(n: number): string {
  return int.format(n);
}

/**
 * Axis label that stays short at every magnitude the chart reaches: daily
 * bars run in the tens of thousands ("$40K"), weekly in the hundreds
 * ("$600K"), monthly in the millions ("$2.5M").
 */
export function formatAxisValue(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `$${round1(amount / 1_000_000)}M`;
  return `$${round1(amount / 1_000)}K`;
}

function round1(n: number): string {
  return String(Math.round(n * 10) / 10);
}

/*
 * Dates arrive as bare ISO days. Every helper below appends T00:00:00 so they
 * parse as *local* midnight — parsing "2026-01-01" bare is UTC midnight, which
 * is still 31 Dec anywhere west of Greenwich.
 */
const monthShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const monthLong = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parse(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** "27 Jul"-style chart tick from an ISO date. */
export function formatTick(iso: string): string {
  const d = parse(iso);
  return `${d.getDate()} ${monthShort[d.getMonth()]}`;
}

/** "Tue, 18 Aug" — the readout heading for a single day. */
export function formatDayLabel(iso: string): string {
  const d = parse(iso);
  return `${dayShort[d.getDay()]}, ${d.getDate()} ${monthShort[d.getMonth()]}`;
}

/**
 * "Aug ’26" — month ticks always carry the year. A month range can span two
 * years, and a bare "Mar" on an 18-month axis is genuinely ambiguous.
 */
export function formatMonthTick(iso: string): string {
  const d = parse(iso);
  return `${monthShort[d.getMonth()]} ’${String(d.getFullYear()).slice(-2)}`;
}

/** "August 2026" — the readout heading for a month. */
export function formatMonthLabel(iso: string): string {
  const d = parse(iso);
  return `${monthLong[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * "26 Jul – 25 Aug", the comp's own period style. Two refinements on top of it:
 * a range inside one month names that month once ("12 – 18 Aug"), and the year
 * appears only when it isn't the year the dashboard is reporting on — so the
 * common case stays exactly as short as the comp drew it.
 */
export function formatDateRange(
  fromIso: string,
  toIso: string,
  anchorYear: number,
): string {
  const from = parse(fromIso);
  const to = parse(toIso);
  const fromYear = from.getFullYear();
  const toYear = to.getFullYear();

  const head = `${from.getDate()} ${monthShort[from.getMonth()]}`;
  const tail = `${to.getDate()} ${monthShort[to.getMonth()]}`;
  const year = (span: string, y: number) => (y === anchorYear ? span : `${span} ${y}`);

  if (fromIso === toIso) return year(head, fromYear);
  if (fromYear !== toYear) return `${head} ${fromYear} – ${tail} ${toYear}`;
  if (from.getMonth() === to.getMonth()) {
    return year(`${from.getDate()} – ${tail}`, fromYear);
  }
  return year(`${head} – ${tail}`, fromYear);
}
