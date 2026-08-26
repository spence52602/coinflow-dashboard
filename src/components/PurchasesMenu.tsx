"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots } from "./icons";

export function PurchasesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-[1.625rem] w-[1.625rem] items-center justify-center p-0"
        aria-label="Table menu"
      >
        <span className="block h-[0.875rem] w-[0.875rem] opacity-[0.44]" aria-hidden="true">
          <IconDots />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Purchases</DropdownMenuLabel>
        <DropdownMenuItem>Export purchases</DropdownMenuItem>
        <DropdownMenuItem>Column settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View all purchases</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
