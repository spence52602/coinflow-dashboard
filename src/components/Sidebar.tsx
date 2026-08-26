import Image from "next/image";
import type { Account, Attention, DashboardData, Merchant, Period, VolumeSummary } from "@/data/types";
import { IconArrowUpRight, IconDocumentation, IconExternal } from "./icons";
import { MerchantSwitcher } from "./MerchantSwitcher";
import { SidebarNav } from "./SidebarNav";
import { SearchCommand } from "./SearchCommand";

interface SidebarProps {
  merchant: Merchant;
  account: Account;
  exceptionsCount: number;
  purchases: DashboardData["purchases"];
  volume: VolumeSummary;
  period: Period;
  attention: Attention;
}

export function Sidebar({ merchant, account, exceptionsCount, purchases, volume, period, attention }: SidebarProps) {
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

      <SidebarNav exceptionsCount={exceptionsCount} attention={attention} />

      <div className="mt-auto pt-4 max-lg:hidden">
        <a
          className="flex items-center gap-3 px-[0.625rem] py-[0.5625rem] text-[0.8125rem] font-medium text-muted no-underline"
          href="#"
        >
          <span className="block h-[1.0625rem] w-[1.625rem] flex-[0_0_1.625rem] px-[0.28125rem] text-icon-sidebar" aria-hidden="true">
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
