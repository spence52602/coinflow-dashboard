import Image from "next/image";
import type { Account, DashboardData, Merchant, Period, VolumeSummary } from "@/data/types";
import {
  IconArrowUpRight,
  IconChevron,
  IconDevelopers,
  IconDocumentation,
  IconExceptions,
  IconExternal,
  IconHome,
  IconPayments,
  IconPayouts,
  IconReports,
  IconSettings,
} from "./icons";
import { MerchantSwitcher } from "./MerchantSwitcher";
import { SearchCommand } from "./SearchCommand";
import { cn } from "@/lib/utils";

interface SidebarProps {
  merchant: Merchant;
  account: Account;
  exceptionsCount: number;
  purchases: DashboardData["purchases"];
  volume: VolumeSummary;
  period: Period;
}

const operateItems = [
  { label: "Home", icon: IconHome, active: true },
  { label: "Payments", icon: IconPayments },
  { label: "Payouts", icon: IconPayouts },
  { label: "Exceptions", icon: IconExceptions, hasCount: true },
];

const manageItems = [
  { label: "Reports", icon: IconReports },
  { label: "Developers", icon: IconDevelopers },
  { label: "Settings", icon: IconSettings },
];

const itemClass =
  "relative flex items-center gap-3 rounded-control py-[0.585rem] pl-[0.625rem] pr-[0.38rem] text-muted no-underline";
const itemActiveClass =
  "bg-select text-ink before:absolute before:-left-4 before:bottom-0 before:top-0 before:w-4 before:bg-select before:content-[''] after:absolute after:-left-4 after:bottom-0 after:top-0 after:w-[0.16rem] after:rounded-r-control after:bg-ink after:content-['']";
const itemIconClass =
  "block h-[1.0625rem] w-[1.625rem] flex-[0_0_1.625rem] px-[0.28125rem] text-icon-sidebar";
const chevronClass = "block h-4 w-4 flex-[0_0_1rem] text-icon-chevron";

export function Sidebar({ merchant, account, exceptionsCount, purchases, volume, period }: SidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[17.5rem] flex-[0_0_17.5rem] flex-col overflow-y-auto border-r-[0.0625rem] border-rule bg-chrome px-4 pb-[1.3125rem] pt-6 max-lg:static max-lg:h-auto max-lg:w-full max-lg:overflow-visible max-lg:flex-none max-lg:flex-row max-lg:items-center max-lg:gap-4 max-lg:border-b-[0.0625rem] max-lg:border-r-0 max-lg:px-5 max-lg:py-3">
      <div className="pb-[1.59rem] pl-[0.0625rem] pt-[0.625rem] max-lg:p-0">
        {/* Brand lockup — committed vector from the Figma file (178:6369). */}
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size committed SVG */}
        <img
          className="block h-[1.6875rem] w-auto max-lg:h-6"
          src="/img/coinflow-lockup.svg"
          alt="Coinflow"
        />
      </div>

      <MerchantSwitcher merchant={merchant} />
      <SearchCommand purchases={purchases} volume={volume} period={period} />

      <div className="px-[0.8125rem] pb-[0.5625rem] pt-[1.375rem] text-xs font-normal uppercase leading-[normal] tracking-[0.04em] text-subtle max-lg:hidden">
        Operate
      </div>
      <nav
        className="flex flex-col gap-[0.0625rem] max-lg:hidden"
        aria-label="Operate"
      >
        {operateItems.map(({ label, icon: Icon, active, hasCount }) => (
          <a
            key={label}
            href="#"
            className={cn(itemClass, active && itemActiveClass)}
            aria-current={active ? "page" : undefined}
          >
            <span
              className={cn(itemIconClass, active && "text-icon-active")}
              aria-hidden="true"
            >
              <Icon />
            </span>
            <span className="flex-1 text-[0.8125rem] font-medium tracking-[-0.005em]">
              {label}
            </span>
            {hasCount ? (
              <span className="rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-[0.0625rem] font-serif text-[0.6875rem] font-bold leading-[1.25] tracking-[0.01em] text-ink tabular-nums">
                {exceptionsCount}
              </span>
            ) : null}
            {!active ? (
              <span className={chevronClass} aria-hidden="true">
                <IconChevron />
              </span>
            ) : null}
          </a>
        ))}
      </nav>

      <div className="px-[0.8125rem] pb-[0.5625rem] pt-[1.375rem] text-xs font-normal uppercase leading-[normal] tracking-[0.04em] text-subtle max-lg:hidden">
        Manage
      </div>
      <nav
        className="flex flex-col gap-[0.0625rem] max-lg:hidden"
        aria-label="Manage"
      >
        {manageItems.map(({ label, icon: Icon }) => (
          <a key={label} href="#" className={itemClass}>
            <span className={itemIconClass} aria-hidden="true">
              <Icon />
            </span>
            <span className="flex-1 text-[0.8125rem] font-medium tracking-[-0.005em]">
              {label}
            </span>
            <span className={chevronClass} aria-hidden="true">
              <IconChevron />
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 max-lg:hidden">
        <a
          className="flex items-center gap-3 px-[0.625rem] py-[0.5625rem] text-[0.8125rem] font-medium text-muted no-underline"
          href="#"
        >
          <span className={itemIconClass} aria-hidden="true">
            <IconDocumentation />
          </span>
          Documentation
          <span
            className="ml-auto block h-4 w-4 flex-[0_0_1rem] text-icon-chevron"
            aria-hidden="true"
          >
            <IconArrowUpRight />
          </span>
        </a>
        <div className="mt-[0.375rem] flex items-center gap-[0.5625rem] border-t-[0.0625rem] border-rule pb-[0.1875rem] pl-[0.47rem] pr-[0.625rem] pt-[0.6875rem]">
          <span className="relative block h-[1.96875rem] w-[1.96875rem] flex-[0_0_1.96875rem] overflow-hidden rounded-[0.09375rem] border-[0.03rem] border-avatar-border">
            <Image
              src={account.avatar}
              alt=""
              width={63}
              height={63}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </span>
          <span className="block min-w-0 flex-1">
            <span className="block text-xs font-medium uppercase leading-[1.35] tracking-[0.04em] text-subtle">
              Account
            </span>
            <span className="block truncate text-[0.8125rem] font-medium leading-[1.4] text-ink">
              {account.email}
            </span>
          </span>
          <button
            className="mt-[0.4rem] block h-[1.0625rem] w-[1.0625rem] flex-[0_0_1.0625rem] p-0 text-icon-chevron"
            type="button"
            aria-label="Sign out"
          >
            <IconExternal />
          </button>
        </div>
      </div>
    </aside>
  );
}
