/** Formatting helpers — single source for currency/number rendering. */

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

/** "$120K"-style axis label for whole-thousand values. */
export function formatAxisK(amount: number): string {
  return `$${Math.round(amount / 1000)}K`;
}

const tickMonth = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "27 Jul"-style chart tick from an ISO date. */
export function formatTick(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()} ${tickMonth[d.getMonth()]}`;
}
