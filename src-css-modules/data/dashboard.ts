import type { DashboardData, VolumePoint } from "./types";
import rawSeries from "./volume-series.json";

/**
 * Mock dashboard payload.
 *
 * The daily gross-volume series was extracted from the redesigned Gross
 * Volume card in the Figma file (values reconstructed from the drawn bar
 * heights against the $40K gridline spacing; weekends carry the lighter
 * tone). `volume.total` is the reported summary figure — the chart draws
 * the series, the headline prints the summary, matching how a real
 * summary + timeseries API pair behaves.
 */
const series: VolumePoint[] = (
  rawSeries as Array<{ date: string; amount: number; weekend: boolean }>
).map(({ date, amount, weekend }) => ({ date, amount, weekend }));

const data: DashboardData = {
  merchant: {
    label: "Merchant ID",
    displayId: "#spenceh",
    initials: "SH",
    avatar: "/img/av-sh.png",
  },
  account: {
    email: "spence@spenceh.co",
    avatar: "/img/av-photo.png",
  },
  userFirstName: "Spence",
  /* The comp labels 25 Aug 2026 "Monday" (it's a Tuesday) — kept verbatim
     for fidelity. A live integration should derive this from the date. */
  dateLine: "Monday, 25 August",
  period: {
    from: "2026-07-26",
    to: "2026-08-25",
    label: "26 Jul – 25 Aug",
  },
  volume: {
    total: 2_847_392.18,
    delta: {
      amount: 314_208.52,
      percent: 12.4,
      direction: "up",
      comparedTo: "26 Jun – 25 Jul",
    },
    series,
  },
  activeRange: "1M",
  stats: [
    {
      key: "net-volume",
      label: "Net volume",
      value: "$2,731,447.02",
      note: "After $115,945.16 in processing fees",
      spark: [38.75, 36.88, 36.64, 38.54, 41.03, 42.86, 44.95, 46.9, 47.72, 48.61, 50.03, 50.96, 51.28, 51.83, 52.77, 53.39, 53.21, 53.02, 53.01, 53.57, 54.73, 56.27, 58.32, 61.03],
    },
    {
      key: "acceptance-rate",
      label: "Acceptance rate",
      value: "97.8%",
      note: "Down 0.4 pts — 3DS friction on EU cards",
      spark: [50.52, 49.97, 50.36, 51.03, 51.43, 51.85, 52.92, 53.8, 53.08, 52.27, 52.48, 52.84, 52.54, 51.91, 51.55, 50.84, 48.97, 47.25, 46.38, 46.51, 47.63, 48.82, 49.1, 48.62],
    },
    {
      key: "active-customers",
      label: "Active customers",
      value: "18,432",
      note: "1,204 first-time buyers this period",
      spark: [31.23, 33.55, 35.41, 35.82, 35.27, 35.07, 35.36, 36.01, 37.17, 39.07, 40.65, 40.45, 40.03, 40.81, 42.03, 43.11, 44.63, 46.98, 49.02, 50.47, 52.35, 54.07, 55.53, 57.64],
    },
  ],
  purchases: {
    totalCount: 4118,
    items: [
      {
        id: "pur_01",
        customer: {
          name: "Maya Rodríguez",
          email: "maya.r@northwind.io",
          initials: "MR",
          avatar: "/img/av-mr.png",
        },
        method: { label: "Visa ··", figure: "4412" },
        occurredAt: "25 Aug, 09:14",
        status: "settled",
        amount: 1_249.0,
      },
      {
        id: "pur_02",
        customer: {
          name: "Devon Okafor",
          email: "devon@larkfield.co",
          initials: "DO",
          avatar: "/img/av-do.png",
        },
        method: { label: "USDC · Base" },
        occurredAt: "25 Aug, 08:52",
        status: "settled",
        amount: 18_400.0,
      },
      {
        id: "pur_03",
        customer: {
          name: "Anders Krogh",
          email: "a.krogh@vestmar.dk",
          initials: "AK",
          avatar: "/img/av-ak.png",
        },
        method: { label: "SEPA · IBAN" },
        occurredAt: "25 Aug, 08:07",
        status: "pending",
        amount: 6_780.5,
      },
      {
        id: "pur_04",
        customer: {
          name: "Thandiwe Ncube",
          email: "thandi@kopano.africa",
          initials: "TN",
          avatar: "/img/av-tn.png",
        },
        method: { label: "Mastercard ··", figure: "9071" },
        occurredAt: "24 Aug, 23:41",
        status: "settled",
        amount: 342.75,
      },
    ],
  },
  attention: {
    title: "Six items need your response",
    items: [
      {
        id: "att_disputes",
        label: "Disputes",
        note: "2 respond by Thursday",
        count: 3,
        icon: "disputes",
      },
      {
        id: "att_info",
        label: "Information requests",
        note: "Underwriting: Kopano",
        count: 1,
        icon: "information",
      },
      {
        id: "att_ach",
        label: "ACH returns",
        note: "R01: insufficient funds",
        count: 2,
        icon: "ach",
      },
    ],
  },
  onboarding: {
    title: "Make the most of Coinflow",
    stepsTotal: 6,
    stepsComplete: 4,
    art: "/img/onboarding-art.jpg",
  },
  payout: {
    amount: 412_880.44,
    arrivesNote: "Arrives tomorrow · 09:00 ET",
    batchedPercent: 74,
    account: { label: "Chase ··", figure: "8841" },
    status: "Batching",
  },
  exceptionsCount: 6,
};

/**
 * The one integration point. Swap the body for a real fetch (it can become
 * async) — every component receives its slice via props from the page.
 */
export function getDashboardData(): DashboardData {
  return data;
}
