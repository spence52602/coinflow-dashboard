/**
 * Covers the CSV builders behind the menu actions.
 *
 * `downloadBlob` is module-private and reaches for Blob, an anchor, and
 * object URLs, so these tests capture the Blob's contents through a stubbed
 * `URL.createObjectURL` rather than asserting on a download that jsdom will
 * never actually perform. What matters is the bytes we would have written.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Purchase } from "@/data/types";
import {
  downloadSeriesCsv,
  downloadPurchasesCsv,
  downloadReportCsv,
  volumeSummaryText,
  copyText,
} from "./export";

let written: { name: string; body: string } | null = null;

beforeEach(() => {
  written = null;
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:stub");
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(
    HTMLAnchorElement.prototype,
    "click",
  ).mockImplementation(function (this: HTMLAnchorElement) {
    // name is captured here; the body was stashed by the Blob stub below.
    written = { name: this.download, body: written?.body ?? "" };
  });
  const RealBlob = globalThis.Blob;
  vi.stubGlobal(
    "Blob",
    class extends RealBlob {
      constructor(parts: BlobPart[], opts?: BlobPropertyBag) {
        super(parts, opts);
        written = { name: written?.name ?? "", body: String(parts[0]) };
      }
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const series = [
  { date: "2026-07-27", amount: 1000, weekend: false },
  { date: "2026-07-28", amount: 2500.5, weekend: true },
];

describe("downloadSeriesCsv", () => {
  it("writes a header row followed by one row per point", () => {
    downloadSeriesCsv(series, "Jul 2026");
    expect(written?.body.split("\n")).toEqual([
      "date,gross_volume_usd,weekend",
      "2026-07-27,1000.00,false",
      "2026-07-28,2500.50,true",
    ]);
  });

  it("strips spaces and en-dashes out of the filename", () => {
    downloadSeriesCsv(series, "27 Jul – 2 Aug");
    // An en-dash in a filename is hostile to shells and older filesystems.
    expect(written?.name).toBe("coinflow-gross-volume-27Jul-2Aug.csv");
    expect(written?.name).not.toContain("–");
    expect(written?.name).not.toContain(" ");
  });

  it("always writes amounts to two decimals", () => {
    downloadSeriesCsv([{ date: "2026-01-01", amount: 7, weekend: false }], "x");
    expect(written?.body).toContain("2026-01-01,7.00,false");
  });
});

describe("downloadPurchasesCsv", () => {
  /** Build a complete Purchase so the tests type-check against the real shape. */
  function purchase(over: Partial<Purchase> = {}): Purchase {
    return {
      id: "p_1",
      customer: {
        name: "Jane Doe",
        email: "jane@example.com",
        initials: "JD",
        avatar: "/img/av-1.png",
      },
      method: { label: "Visa", figure: "4242" },
      occurredAt: "25 Aug, 09:14",
      status: "settled",
      amount: 120,
      ...over,
    };
  }

  it("quotes the fields that can contain commas", () => {
    downloadPurchasesCsv({
      items: [
        purchase({
          customer: {
            name: "Doe, Jane",
            email: "jane@example.com",
            initials: "JD",
            avatar: "/img/av-1.png",
          },
          occurredAt: "Jul 27, 2026",
        }),
      ],
      totalCount: 1,
    });
    const row = written!.body.split("\n")[1];
    expect(row).toContain('"Doe, Jane"');
    expect(row).toContain('"Jul 27, 2026"');
    expect(row).toContain('"Visa 4242"');
    expect(row).toContain("120.00");
  });

  it("omits the trailing space when a method has no figure", () => {
    downloadPurchasesCsv({
      items: [purchase({ method: { label: "ACH" }, status: "pending" })],
      totalCount: 1,
    });
    expect(written?.body).toContain('"ACH"');
    expect(written?.body).not.toContain('"ACH "');
  });

  it("writes one row per purchase under a single header", () => {
    downloadPurchasesCsv({
      items: [purchase({ id: "a" }), purchase({ id: "b" })],
      totalCount: 2,
    });
    const lines = written!.body.split("\n");
    expect(lines[0]).toBe("customer,email,method,occurred_at,status,amount_usd");
    expect(lines).toHaveLength(3);
  });
});

describe("downloadReportCsv", () => {
  it("leads with the summary block and blank-line separates the series", () => {
    downloadReportCsv({
      periodLabel: "Jul 2026",
      total: 50000,
      deltaAmount: 1200,
      deltaPercent: 2.4,
      series,
    });
    const lines = written!.body.split("\n");
    expect(lines[0]).toBe("Coinflow report,Jul 2026");
    expect(lines[1]).toBe("Gross volume,50000.00");
    expect(lines[2]).toBe("Change vs previous period,1200.00 (2.4%)");
    expect(lines[3]).toBe("");
    expect(lines[4]).toBe("date,gross_volume_usd");
  });
});

describe("volumeSummaryText", () => {
  it("renders currency rather than raw numbers", () => {
    expect(
      volumeSummaryText({
        periodLabel: "Jul 2026",
        total: 50000,
        deltaAmount: 1200,
        deltaPercent: 2.4,
        comparedTo: "Jun 2026",
      }),
    ).toBe(
      "Gross volume Jul 2026: $50,000.00 · up $1,200.00 (2.4%) vs. Jun 2026",
    );
  });
});

describe("copyText", () => {
  it("reports success when the clipboard accepts the write", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    await expect(copyText("hi")).resolves.toBe(true);
  });

  it("reports failure instead of throwing when the clipboard is blocked", async () => {
    // Clipboard writes reject without a user gesture or on an insecure
    // origin. Callers show a toast off this boolean, so it must not throw.
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    await expect(copyText("hi")).resolves.toBe(false);
  });
});
