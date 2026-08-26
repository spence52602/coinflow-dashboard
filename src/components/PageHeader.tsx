import type { Period } from "@/data/types";
import { IconBell, IconCalendar, IconChevron, IconExport } from "./icons";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  userFirstName: string;
  dateLine: string;
  period: Period;
}

const tabs = ["Overview", "Payments", "Payouts", "Customers"];

const btnClass =
  "inline-flex items-center gap-[0.4375rem] rounded-control border-[0.0625rem] border-rule bg-transparent px-[0.8125rem] py-[0.4375rem] font-sans text-[0.8125rem] font-medium text-ink";

export function PageHeader({ userFirstName, dateLine, period }: PageHeaderProps) {
  return (
    <header className="px-10 pt-[1.875rem] max-lg:px-5 max-lg:pt-5">
      <div className="flex items-start justify-between gap-6 max-lg:flex-col">
        <div>
          <h1 className="t-h3">Good morning, {userFirstName}</h1>
          <div className="mt-[0.375rem] text-sm leading-[1.4] text-muted">
            {dateLine}
          </div>
        </div>
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
          <button className={btnClass} type="button">
            <span className="block h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true">
              <IconExport />
            </span>
            Export
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-control border-[0.0625rem] border-rule bg-transparent"
            type="button"
            aria-label="Notifications"
          >
            <span className="block h-[0.9rem] w-[0.9rem] text-icon-rail" aria-hidden="true">
              <IconBell />
            </span>
          </button>
        </div>
      </div>
      <nav
        className="mt-[1.375rem] flex items-center justify-between border-b-[0.0625rem] border-rule max-lg:overflow-x-auto"
        aria-label="Sections"
      >
        <div className="flex gap-[1.625rem]">
          {tabs.map((tab, i) => (
            <a
              key={tab}
              href="#"
              className={cn(
                "relative pb-[0.6875rem] text-sm font-medium leading-[normal] tracking-[-0.005em] text-muted no-underline",
                i === 0 &&
                  "text-ink after:absolute after:-bottom-[0.0625rem] after:left-0 after:right-0 after:h-[0.0625rem] after:bg-ink after:content-['']",
              )}
              aria-current={i === 0 ? "page" : undefined}
            >
              {tab}
            </a>
          ))}
        </div>
        <button
          className="inline-flex items-center gap-[0.3125rem] border-none bg-transparent pb-[0.625rem] font-sans text-[0.8125rem] font-medium tracking-[-0.005em] text-muted"
          type="button"
        >
          Local time
          <span
            className="block h-3 w-3 text-icon-chevron"
            aria-hidden="true"
          >
            <IconChevron style={{ transform: "rotate(90deg)" }} />
          </span>
        </button>
      </nav>
    </header>
  );
}
