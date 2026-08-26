"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Copy, Plus, Settings2 } from "lucide-react";
import type { Merchant } from "@/data/types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconChevron } from "./icons";
import { copyText } from "@/lib/export";

interface MerchantSwitcherProps {
  merchant: Merchant;
}

const menuIcon = "h-[0.9rem] w-[0.9rem] text-icon-rail";

export function MerchantSwitcher({ merchant }: MerchantSwitcherProps) {
  const [copied, setCopied] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="mb-[1.375rem] flex w-full items-center gap-[0.5625rem] rounded-control border-[0.0625rem] border-rule bg-transparent py-[0.47rem] pl-3 pr-[0.625rem] text-left max-lg:mb-0 max-lg:w-auto"
        aria-label={`Merchant: ${merchant.displayId}. Switch merchant`}
      >
        <span
          className="relative block h-[1.71875rem] w-[1.71875rem] flex-[0_0_1.71875rem] overflow-hidden rounded-control border-[0.03rem] border-avatar-border bg-avatar-bg"
          aria-hidden="true"
        >
          <Image
            src={merchant.avatar}
            alt=""
            width={56}
            height={56}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center text-[0.8125rem] font-normal leading-none tracking-[0.02em] text-inverse">
            {merchant.initials}
          </span>
        </span>
        <span className="block min-w-0 flex-1">
          <span className="mb-[0.15rem] block text-xs font-medium uppercase leading-[1.35] tracking-[0.04em] text-merchant-label">
            {merchant.label}
          </span>
          <span className="block truncate text-[0.8125rem] font-medium leading-[1.4] text-merchant-value">
            {merchant.displayId}
          </span>
        </span>
        <span
          className="block h-4 w-4 flex-[0_0_1rem] text-icon-chevron"
          aria-hidden="true"
        >
          {/* style prop intentionally replaces the icon's base style — this
              reproduces the original build's inline-svg rendering exactly. */}
          <IconChevron style={{ transform: "rotate(90deg)" }} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[15.5rem]">
        <DropdownMenuLabel>Merchant</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>
          {merchant.displayId}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void copyText(merchant.displayId).then((ok) => {
              if (ok) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }
            });
          }}
        >
          {copied ? (
            <Check className={menuIcon} aria-hidden="true" />
          ) : (
            <Copy className={menuIcon} aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy merchant ID"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings2 className={menuIcon} aria-hidden="true" />
          Merchant settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className={menuIcon} aria-hidden="true" />
          Add merchant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
