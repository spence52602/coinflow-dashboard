import type { Payout } from "@/data/types";
import { formatCurrency } from "@/data/format";
import { IconCtaArrow } from "../icons";

interface NextPayoutProps {
  payout: Payout;
}

export function NextPayout({ payout }: NextPayoutProps) {
  return (
    <section
      className="border-[0.0625rem] border-rule bg-paper px-6 py-5"
      aria-label="Next payout"
    >
      <div className="flex items-center justify-between">
        <span className="t-label text-muted">Next payout</span>
        <span className="inline-flex items-center gap-[0.3125rem] rounded-control border-[0.0625rem] border-rule px-[0.4375rem] py-1 text-[0.6875rem] font-medium leading-none tracking-[0.01em] text-muted">
          <i className="block h-1 w-1 rounded-control border-[0.0625rem] border-subtle bg-transparent" />
          {payout.status}
        </span>
      </div>
      <div className="pt-[1.125rem]">
        <span className="t-fig-sm">{formatCurrency(payout.amount)}</span>
        <div className="mt-[0.375rem] text-[0.8125rem] leading-[1.5] text-muted">
          {payout.arrivesNote}
        </div>
        <div
          className="mt-[0.875rem] h-[0.625rem] overflow-hidden rounded-control bg-solid"
          role="progressbar"
          aria-valuenow={payout.batchedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Batching progress"
        >
          <i
            className="block h-full bg-ink"
            style={{ width: `${payout.batchedPercent}%` }}
          />
        </div>
        <div className="mt-[0.5625rem] flex justify-between text-xs leading-[1.4] text-muted">
          <span>
            {payout.account.label}{" "}
            <span className="font-serif tabular-nums">{payout.account.figure}</span>
          </span>
          <span>{payout.batchedPercent}% batched</span>
        </div>
        <a
          className="mt-4 flex h-[2.4375rem] w-full items-center justify-center gap-[0.4375rem] rounded-control border-[0.0625rem] border-muted bg-transparent text-sm font-medium leading-[normal] text-ink no-underline"
          href="#"
        >
          Payout schedule
          <span className="block h-[0.975rem] w-[0.975rem]" aria-hidden="true">
            <IconCtaArrow />
          </span>
        </a>
      </div>
    </section>
  );
}
