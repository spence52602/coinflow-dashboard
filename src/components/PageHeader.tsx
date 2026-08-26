import type { Attention, Period, VolumeSummary } from "@/data/types";
import { IconChevron } from "./icons";
import { HeaderActions } from "./HeaderActions";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  userFirstName: string;
  dateLine: string;
  period: Period;
  volume: VolumeSummary;
  attention: Attention;
}

const tabs = ["Overview", "Payments", "Payouts", "Customers"];

export function PageHeader({
  userFirstName,
  dateLine,
  period,
  volume,
  attention,
}: PageHeaderProps) {
  return (
    <header className="px-10 pt-[1.875rem] max-lg:px-5 max-lg:pt-5">
      <div className="flex items-start justify-between gap-6 max-lg:flex-col">
        <div>
          <h1 className="t-h3">Good morning, {userFirstName}</h1>
          <div className="mt-[0.375rem] text-sm leading-[1.4] text-muted">
            {dateLine}
          </div>
        </div>
        <HeaderActions period={period} volume={volume} attention={attention} />
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
