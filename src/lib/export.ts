import type { DashboardData, VolumePoint } from "@/data/types";
import { formatCurrency } from "@/data/format";

/** Client-side CSV/clipboard helpers backing the menu actions. */

function downloadBlob(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSeriesCsv(series: VolumePoint[], periodLabel: string) {
  const rows = [
    "date,gross_volume_usd,weekend",
    ...series.map((p) => `${p.date},${p.amount.toFixed(2)},${p.weekend}`),
  ];
  downloadBlob(
    `coinflow-gross-volume-${periodLabel.replaceAll(" ", "").replaceAll("–", "-")}.csv`,
    "text/csv",
    rows.join("\n"),
  );
}

export function downloadPurchasesCsv(
  purchases: DashboardData["purchases"],
) {
  const rows = [
    "customer,email,method,occurred_at,status,amount_usd",
    ...purchases.items.map((p) =>
      [
        `"${p.customer.name}"`,
        p.customer.email,
        `"${p.method.label}${p.method.figure ? ` ${p.method.figure}` : ""}"`,
        `"${p.occurredAt}"`,
        p.status,
        p.amount.toFixed(2),
      ].join(","),
    ),
  ];
  downloadBlob("coinflow-recent-purchases.csv", "text/csv", rows.join("\n"));
}

export function downloadReportCsv(data: {
  periodLabel: string;
  total: number;
  deltaAmount: number;
  deltaPercent: number;
  series: VolumePoint[];
}) {
  const rows = [
    `Coinflow report,${data.periodLabel}`,
    `Gross volume,${data.total.toFixed(2)}`,
    `Change vs previous period,${data.deltaAmount.toFixed(2)} (${data.deltaPercent}%)`,
    "",
    "date,gross_volume_usd",
    ...data.series.map((p) => `${p.date},${p.amount.toFixed(2)}`),
  ];
  downloadBlob(
    `coinflow-report-${data.periodLabel.replaceAll(" ", "").replaceAll("–", "-")}.csv`,
    "text/csv",
    rows.join("\n"),
  );
}

export function volumeSummaryText(data: {
  periodLabel: string;
  total: number;
  deltaAmount: number;
  deltaPercent: number;
  comparedTo: string;
}) {
  return `Gross volume ${data.periodLabel}: ${formatCurrency(data.total)} · up ${formatCurrency(data.deltaAmount)} (${data.deltaPercent}%) vs. ${data.comparedTo}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
