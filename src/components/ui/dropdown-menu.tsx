"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

function DropdownMenu(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>,
) {
  return (
    <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[11rem] rounded-frame border-[0.0625rem] border-rule bg-popover p-[0.25rem] text-popover-foreground shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-control px-[0.8125rem] py-[0.4375rem] font-sans text-[0.8125rem] font-medium text-ink outline-hidden data-highlighted:bg-accent data-[disabled]:pointer-events-none data-[disabled]:text-subtle",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-control px-[0.8125rem] py-[0.4375rem] font-sans text-[0.8125rem] font-medium text-ink outline-hidden data-highlighted:bg-accent",
        className,
      )}
      {...props}
    >
      <span className="flex w-3 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <svg viewBox="0 0 12 12" className="block h-2.5 w-2.5" aria-hidden>
            <path
              d="M2.5 6.5 5 9l4.5-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("t-label px-[0.8125rem] pb-1 pt-[0.4375rem] text-subtle", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("mx-[0.25rem] my-[0.25rem] h-[0.0625rem] bg-rule-soft", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
