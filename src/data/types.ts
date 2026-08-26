/**
 * Dashboard domain types.
 *
 * These mirror the shape a real Coinflow API would return. The mock in
 * `dashboard.ts` implements `getDashboardData()`; wiring live data means
 * replacing that one function (or fetching and validating into these types) —
 * no component knows where the data came from.
 */

export interface Merchant {
  /** Uppercase field label in the switcher, e.g. "MERCHANT ID". */
  label: string;
  /** Display value, e.g. "#spenceh". */
  displayId: string;
  initials: string;
  /** Avatar art tile, path under /public. */
  avatar: string;
}

export interface Account {
  email: string;
  /** Avatar photo, path under /public. */
  avatar: string;
}

export interface Period {
  /** ISO dates, inclusive. */
  from: string;
  to: string;
  /** Preformatted control label, e.g. "26 Jul – 25 Aug". */
  label: string;
}

export interface VolumeDelta {
  amount: number;
  percent: number;
  direction: "up" | "down";
  /** Preformatted comparison period, e.g. "26 Jun – 25 Jul". */
  comparedTo: string;
}

export interface VolumePoint {
  /** ISO date. */
  date: string;
  amount: number;
  /** Weekend days render in the lighter bar tone. */
  weekend: boolean;
}

export interface VolumeSummary {
  /**
   * Reported gross volume for the period. Comes from the summary endpoint —
   * it is NOT derived from `series` (the two can drift in real data; the
   * chart draws the series, the headline prints the summary).
   */
  total: number;
  delta: VolumeDelta;
  series: VolumePoint[];
}

export type VolumeRange = "1D" | "1W" | "1M" | "3M" | "YTD" | "ALL";

export interface StatSummary {
  key: string;
  label: string;
  /** Preformatted headline value ("$2,731,447.02", "97.8%", "18,432"). */
  value: string;
  note: string;
  /** Normalized sparkline series (arbitrary scale). */
  spark: number[];
}

export type PurchaseStatus = "settled" | "pending";

export interface Purchase {
  id: string;
  customer: {
    name: string;
    email: string;
    initials: string;
    /** Avatar art tile, path under /public. */
    avatar: string;
  };
  /** Payment method, split so the numeric part can be set in figures. */
  method: { label: string; figure?: string };
  /** Preformatted timestamp, e.g. "25 Aug, 09:14". */
  occurredAt: string;
  status: PurchaseStatus;
  amount: number;
}

export interface AttentionItem {
  id: string;
  label: string;
  note: string;
  count: number;
  icon: "disputes" | "information" | "ach";
}

export interface Attention {
  title: string;
  items: AttentionItem[];
}

export interface Onboarding {
  title: string;
  stepsTotal: number;
  stepsComplete: number;
  /** Card artwork, path under /public. */
  art: string;
}

export interface Payout {
  amount: number;
  arrivesNote: string;
  batchedPercent: number;
  account: { label: string; figure: string };
  status: string;
}

export interface DashboardData {
  merchant: Merchant;
  account: Account;
  userFirstName: string;
  /** Preformatted date line under the greeting, e.g. "Monday, 25 August". */
  dateLine: string;
  period: Period;
  volume: VolumeSummary;
  activeRange: VolumeRange;
  stats: StatSummary[];
  purchases: { items: Purchase[]; totalCount: number };
  attention: Attention;
  onboarding: Onboarding;
  payout: Payout;
  exceptionsCount: number;
}
