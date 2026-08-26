"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IconSearch } from "@/components/icons";
import { cn } from "@/lib/utils";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex w-full flex-col overflow-hidden bg-popover", className)}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Search",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & { title?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="visually-hidden">{title}</DialogTitle>
        <Command className="rounded-frame">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      className="flex items-center gap-3 border-b-[0.0625rem] border-rule-soft px-4"
      data-slot="command-input-wrapper"
    >
      <span className="block h-[0.9rem] w-[0.9rem] shrink-0 text-search-placeholder">
        <IconSearch />
      </span>
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-11 w-full bg-transparent font-sans text-[0.8125rem] text-ink outline-hidden placeholder:text-search-placeholder",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[19rem] overflow-y-auto p-[0.25rem]", className)}
      {...props}
    />
  );
}

function CommandEmpty(
  props: React.ComponentProps<typeof CommandPrimitive.Empty>,
) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="px-[0.8125rem] py-4 text-center font-sans text-[0.8125rem] text-subtle"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:t-label overflow-hidden [&_[cmdk-group-heading]]:px-[0.8125rem] [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-[0.4375rem] [&_[cmdk-group-heading]]:text-subtle",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "flex cursor-pointer select-none items-center gap-3 rounded-control px-[0.8125rem] py-[0.4375rem] font-sans text-[0.8125rem] font-medium text-ink outline-hidden data-[selected=true]:bg-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:text-subtle",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-0.5 font-sans text-[0.6875rem] font-medium tracking-[0.02em] text-subtle",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
};
