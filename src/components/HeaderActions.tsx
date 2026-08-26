"use client";

import { ArrowUpRight } from "lucide-react";
import type { Attention, Period, VolumeSummary } from "@/data/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconAttnAch,
  IconAttnDisputes,
  IconAttnInformation,
  IconBell,
  IconCalendar,
  IconChevron,
  IconExport,
} from "./icons";
import { downloadReportCsv } from "@/lib/export";
import { cn } from "@/lib/utils";

interface HeaderActionsProps {
  period: Period;
  volume: VolumeSummary;
  attention: Attention;
}

const btnClass =
  "inline-flex items-center gap-[0.4375rem] rounded-control border-[0.0625rem] border-rule bg-transparent px-[0.8125rem] py-[0.4375rem] font-sans text-[0.8125rem] font-medium text-ink";

const attnIconFor = {
  disputes: IconAttnDisputes,
  information: IconAttnInformation,
  ach: IconAttnAch,
} as const;

export function HeaderActions({ period, volume, attention }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <button
        className={cn(btnClass, "font-serif font-normal tracking-normal tabular-nums")}
        type="button"
      >
        <span className="block h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true">
          <IconCalendar />
        </span>
        {period.label}
        <span
          className="ml-[0.0625rem] block h-[0.975rem] w-[0.975rem] text-icon-chevron"
          aria-hidden="true"
        >
          <IconChevron style={{ transform: "rotate(90deg)" }} />
        </span>
      </button>

      <button
        className={btnClass}
        type="button"
        onClick={() =>
          downloadReportCsv({
            periodLabel: period.label,
            total: volume.total,
            deltaAmount: volume.delta.amount,
            deltaPercent: volume.delta.percent,
            series: volume.series,
          })
        }
      >
        <span className="block h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true">
          <IconExport />
        </span>
        Export
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-8 w-8 items-center justify-center rounded-control border-[0.0625rem] border-rule bg-transparent"
          aria-label="Notifications"
        >
          <span className="block h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true">
            <IconBell />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[19rem]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {attention.items.map((item) => {
            const Icon = attnIconFor[item.icon];
            return (
              <DropdownMenuItem key={item.id} className="items-start py-[0.5625rem]">
                <span
                  className="mt-[0.125rem] block h-[0.9rem] w-[0.9rem] flex-[0_0_0.9rem] text-icon-rail"
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-[1.2]">{item.label}</span>
                  <span className="mt-[0.125rem] block text-xs font-normal leading-[1.3] text-attn-sub">
                    {item.note}
                  </span>
                </span>
                <span className="font-serif text-[0.9375rem] leading-[1.2] text-ink tabular-nums">
                  {item.count}
                </span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArrowUpRight className="h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true" />
            View all in Exceptions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
