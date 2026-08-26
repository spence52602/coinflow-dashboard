"use client";

import * as React from "react";
import type { Attention } from "@/data/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IconChevron,
  IconDevelopers,
  IconExceptions,
  IconHome,
  IconPayments,
  IconPayouts,
  IconReports,
  IconSettings,
} from "./icons";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  exceptionsCount: number;
  attention: Attention;
}

interface NavSection {
  label: string;
  icon: typeof IconPayments;
  children: { label: string; count?: number }[];
}

const rowClass =
  "relative flex w-full items-center gap-3 rounded-control py-[0.585rem] pl-[0.625rem] pr-[0.38rem] text-muted no-underline";
const iconClass =
  "block h-[1.0625rem] w-[1.625rem] flex-[0_0_1.625rem] px-[0.28125rem] text-icon-sidebar";
const labelClass = "flex-1 text-[0.8125rem] font-medium tracking-[-0.005em]";
const chevronClass =
  "block h-4 w-4 flex-[0_0_1rem] text-icon-chevron transition-transform duration-150 group-data-[state=open]:rotate-90";
/* Children indent to the parent label's left edge, Ramp-style. */
const subRowClass =
  "flex items-center rounded-control py-[0.4375rem] pl-12 pr-[0.38rem] text-[0.8125rem] font-medium tracking-[-0.005em] text-muted no-underline hover:bg-solid hover:text-ink";

export function SidebarNav({ exceptionsCount, attention }: SidebarNavProps) {
  const [open, setOpen] = React.useState<string>("");

  const operate: NavSection[] = [
    {
      label: "Payments",
      icon: IconPayments,
      children: [
        { label: "Transactions" },
        { label: "Disputes" },
        { label: "Refunds" },
      ],
    },
    {
      label: "Payouts",
      icon: IconPayouts,
      children: [
        { label: "Scheduled" },
        { label: "History" },
        { label: "Bank accounts" },
      ],
    },
    {
      label: "Exceptions",
      icon: IconExceptions,
      children: attention.items.map((item) => ({
        label: item.label,
        count: item.count,
      })),
    },
  ];

  const manage: NavSection[] = [
    {
      label: "Reports",
      icon: IconReports,
      children: [
        { label: "Volume" },
        { label: "Settlement" },
        { label: "Statements" },
      ],
    },
    {
      label: "Developers",
      icon: IconDevelopers,
      children: [
        { label: "API keys" },
        { label: "Webhooks" },
        { label: "Logs" },
      ],
    },
    {
      label: "Settings",
      icon: IconSettings,
      children: [
        { label: "General" },
        { label: "Team" },
        { label: "Compliance" },
      ],
    },
  ];

  const renderSection = (section: NavSection) => {
    const Icon = section.icon;
    return (
      <AccordionItem key={section.label} value={section.label}>
        <AccordionTrigger className={rowClass}>
          <span className={iconClass} aria-hidden="true">
            <Icon />
          </span>
          <span className={labelClass}>{section.label}</span>
          {section.label === "Exceptions" ? (
            <span className="rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-[0.0625rem] font-serif text-[0.6875rem] font-bold leading-[1.25] tracking-[0.01em] text-ink tabular-nums">
              {exceptionsCount}
            </span>
          ) : null}
          <span className={chevronClass} aria-hidden="true">
            <IconChevron />
          </span>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-[0.0625rem] pb-1 pt-[0.0625rem]">
          {section.children.map((child) => (
            <a key={child.label} href="#" className={subRowClass}>
              <span className="flex-1">{child.label}</span>
              {typeof child.count === "number" ? (
                <span className="pr-[0.4375rem] font-serif text-[0.75rem] text-ink tabular-nums">
                  {child.count}
                </span>
              ) : null}
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <>
      <div className="px-[0.8125rem] pb-[0.5625rem] pt-[1.375rem] text-xs font-normal uppercase leading-[normal] tracking-[0.04em] text-subtle max-lg:hidden">
        Operate
      </div>
      <nav className="max-lg:hidden" aria-label="Operate">
        <a
          href="#"
          className={cn(
            rowClass,
            "bg-select text-ink before:absolute before:-left-4 before:bottom-0 before:top-0 before:w-4 before:bg-select before:content-[''] after:absolute after:-left-4 after:bottom-0 after:top-0 after:w-[0.16rem] after:rounded-r-control after:bg-ink after:content-['']",
          )}
          aria-current="page"
        >
          <span className={cn(iconClass, "text-icon-active")} aria-hidden="true">
            <IconHome />
          </span>
          <span className={labelClass}>Home</span>
        </a>
        <Accordion
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          className="mt-[0.0625rem] flex flex-col gap-[0.0625rem]"
        >
          {operate.map(renderSection)}
        </Accordion>
      </nav>

      <div className="px-[0.8125rem] pb-[0.5625rem] pt-[1.375rem] text-xs font-normal uppercase leading-[normal] tracking-[0.04em] text-subtle max-lg:hidden">
        Manage
      </div>
      <nav className="max-lg:hidden" aria-label="Manage">
        <Accordion
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          className="flex flex-col gap-[0.0625rem]"
        >
          {manage.map(renderSection)}
        </Accordion>
      </nav>
    </>
  );
}
