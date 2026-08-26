"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import type { DashboardData, Period, VolumeSummary } from "@/data/types";
import { formatCurrency } from "@/data/format";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  IconAttnAch,
  IconDevelopers,
  IconDocumentation,
  IconExceptions,
  IconHome,
  IconPayments,
  IconPayouts,
  IconReports,
  IconSearch,
  IconSettings,
} from "./icons";
import { downloadReportCsv } from "@/lib/export";

interface SearchCommandProps {
  purchases: DashboardData["purchases"];
  volume: VolumeSummary;
  period: Period;
}

const navigate = [
  { label: "Home", icon: IconHome },
  { label: "Payments", icon: IconPayments },
  { label: "Payouts", icon: IconPayouts },
  { label: "Exceptions", icon: IconExceptions },
  { label: "Reports", icon: IconReports },
  { label: "Developers", icon: IconDevelopers },
  { label: "Settings", icon: IconSettings },
];

export function SearchCommand({ purchases, volume, period }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);

  const exportReport = React.useCallback(() => {
    downloadReportCsv({
      periodLabel: period.label,
      total: volume.total,
      deltaAmount: volume.delta.amount,
      deltaPercent: volume.delta.percent,
      series: volume.series,
    });
  }, [period.label, volume]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (
        (e.key === "e" || e.key === "E") &&
        e.shiftKey &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        exportReport();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [exportReport]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-[1.625rem] flex w-full items-center gap-3 rounded-control border-[0.0625rem] border-rule bg-transparent px-[0.625rem] py-[0.5625rem] text-left max-lg:hidden"
      >
        <span
          className="mx-[0.35rem] block h-[0.9rem] w-[0.9rem] flex-[0_0_0.9rem] text-search-placeholder"
          aria-hidden="true"
        >
          <IconSearch />
        </span>
        <span className="flex-1 text-[0.8125rem] text-search-placeholder">
          Search
        </span>
        <span className="rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-0.5 text-[0.6875rem] font-medium tracking-[0.02em] text-subtle">
          ⌘K
        </span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Search Coinflow">
        <CommandInput placeholder="Search payments, customers, actions…" />
        <CommandList>
          <CommandEmpty>
            Nothing matches. Try a customer, an amount, or an action.
          </CommandEmpty>
          <CommandGroup heading="Purchases">
            {purchases.items.map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.customer.name} ${p.customer.email} ${p.amount} ${p.method.label}`}
                onSelect={() => setOpen(false)}
              >
                <span
                  className="relative block h-[1.375rem] w-[1.375rem] flex-[0_0_1.375rem] overflow-hidden rounded-[0.09375rem] border-[0.03rem] border-avatar-border bg-avatar-bg"
                  aria-hidden="true"
                >
                  <Image
                    src={p.customer.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[0.5625rem] font-normal tracking-[0.02em] text-inverse">
                    {p.customer.initials}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate leading-[1.2]">
                    {p.customer.name}
                  </span>
                  <span className="block truncate text-xs font-normal leading-[1.3] text-subtle">
                    {p.customer.email}
                  </span>
                </span>
                <span className="font-serif text-[0.8125rem] font-normal text-ink tabular-nums">
                  {formatCurrency(p.amount)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Navigate">
            {navigate.map(({ label, icon: Icon }) => (
              <CommandItem key={label} onSelect={() => setOpen(false)}>
                <span
                  className="block h-[0.9rem] w-[0.9rem] text-icon-rail"
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem
              value="export report csv download"
              onSelect={() => {
                exportReport();
                setOpen(false);
              }}
            >
              <Download className="h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true" />
              Export report
              <CommandShortcut>⇧⌘E</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <span
                className="block h-[0.9rem] w-[0.9rem] text-icon-rail"
                aria-hidden="true"
              >
                <IconAttnAch />
              </span>
              Payout schedule
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <span
                className="block h-[0.9rem] w-[0.9rem] text-icon-rail"
                aria-hidden="true"
              >
                <IconDocumentation />
              </span>
              Documentation
              <ArrowUpRight
                className="ml-auto h-[0.8125rem] w-[0.8125rem] text-icon-chevron"
                aria-hidden="true"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="flex items-center justify-between border-t-[0.0625rem] border-rule-soft px-4 py-[0.5625rem]">
          <span className="flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.02em] text-subtle">
            <span>
              <kbd className="mr-1 rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-0.5">↑↓</kbd>
              navigate
            </span>
            <span>
              <kbd className="mr-1 rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-0.5">↵</kbd>
              select
            </span>
          </span>
          <span className="text-[0.6875rem] font-medium tracking-[0.02em] text-subtle">
            <kbd className="mr-1 rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-0.5">esc</kbd>
            close
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
