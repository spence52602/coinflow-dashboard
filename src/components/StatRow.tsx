"use client";

import type { StatSummary } from "@/data/types";
import { IconArrowUpRight } from "./icons";
import { sparkPath } from "@/lib/spark";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatRowProps {
  stats: StatSummary[];
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
