"use client";

import type { StatSummary } from "@/data/types";
import { IconArrowUpRight } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatRowProps {
  stats: StatSummary[];
}

/** Smooth sparkline path from a series (base design's easing kept). */
function sparkPath(vals: number[], w: number, h: number, pad: number): string {
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

export function StatRow({ stats }: StatRowProps) {
  return (
    <section
      className="border-[0.0625rem] border-rule bg-paper py-5"
      aria-label="Key metrics"
    >
      <TooltipProvider>
        <div className="flex max-lg:flex-col max-lg:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="min-w-0 flex-1 border-r-[0.0625rem] border-rule-soft px-6 last:border-r-0 max-lg:border-r-0"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="t-label text-muted">{stat.label}</span>
                <span
                  className="-mr-[0.3rem] -mt-[0.1rem] block h-[0.98rem] w-[0.98rem] text-seg-idle"
                  aria-hidden="true"
                >
                  <IconArrowUpRight />
                </span>
              </div>
              <div className="flex h-[1.875rem] items-center justify-between gap-5">
                <span className="t-fig-sm">{stat.value}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      className="block h-[1.625rem] w-[5.75rem] flex-[0_0_5.75rem] max-[519px]:hidden"
                    >
                      <svg
                        className="h-full w-full overflow-visible"
                        viewBox="0 0 92 26"
                        aria-hidden="true"
                      >
                        <path
                          d={sparkPath(stat.spark, 90, 26, 5)}
                          stroke="var(--spark-line)"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {stat.label}: {stat.value} · 24-period trend
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="mt-2 text-xs leading-[1.4] text-muted">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </section>
  );
}
