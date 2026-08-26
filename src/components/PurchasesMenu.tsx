"use client";

import { ArrowUpRight, Copy, Download } from "lucide-react";
import type { DashboardData } from "@/data/types";
import { formatCurrency } from "@/data/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots } from "./icons";
import { copyText, downloadPurchasesCsv } from "@/lib/export";

interface PurchasesMenuProps {
  purchases: DashboardData["purchases"];
}

const menuIcon = "h-[0.9rem] w-[0.9rem] text-icon-rail";

export function PurchasesMenu({ purchases }: PurchasesMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-[1.625rem] w-[1.625rem] items-center justify-center p-0"
        aria-label="Purchases menu"
      >
        <span className="block h-[0.875rem] w-[0.875rem] opacity-[0.44]" aria-hidden="true">
          <IconDots />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Recent purchases</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => downloadPurchasesCsv(purchases)}>
          <Download className={menuIcon} aria-hidden="true" />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void copyText(
              purchases.items
                .map(
                  (p) =>
                    `${p.customer.name}\t${p.occurredAt}\t${p.status}\t${formatCurrency(p.amount)}`,
                )
                .join("\n"),
            );
          }}
        >
          <Copy className={menuIcon} aria-hidden="true" />
          Copy as table
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ArrowUpRight className={menuIcon} aria-hidden="true" />
          Open Payments
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
