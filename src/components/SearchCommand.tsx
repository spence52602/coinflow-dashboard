"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  IconDevelopers,
  IconDocumentation,
  IconExceptions,
  IconExport,
  IconHome,
  IconPayments,
  IconPayouts,
  IconReports,
  IconSearch,
  IconSettings,
} from "./icons";

const navigate = [
  { label: "Home", icon: IconHome },
  { label: "Payments", icon: IconPayments },
  { label: "Payouts", icon: IconPayouts },
  { label: "Exceptions", icon: IconExceptions },
  { label: "Reports", icon: IconReports },
  { label: "Developers", icon: IconDevelopers },
  { label: "Settings", icon: IconSettings },
];

const actions = [
  { label: "Export report", icon: IconExport },
  { label: "Documentation", icon: IconDocumentation },
];

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-[1.625rem] flex w-full items-center gap-3 rounded-control border-[0.0625rem] border-rule bg-transparent px-[0.625rem] py-[0.5625rem] text-left max-lg:hidden"
      >
        <span
          className="mx-[0.35rem] block h-[0.9rem] w-[0.9rem] flex-[0_0_0.9rem] text-search-placeholder"
          aria-hidden="true"
        >
          <IconSearch />
        </span>
        <span className="flex-1 text-[0.8125rem] text-search-placeholder">
          Search
        </span>
        <span className="rounded-control border-[0.0625rem] border-rule px-[0.3125rem] py-0.5 text-[0.6875rem] font-medium tracking-[0.02em] text-subtle">
          ⌘K
        </span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Search">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {navigate.map(({ label, icon: Icon }) => (
              <CommandItem key={label} onSelect={() => setOpen(false)}>
                <span
                  className="block h-[0.9rem] w-[0.9rem] text-icon-rail"
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            {actions.map(({ label, icon: Icon }) => (
              <CommandItem key={label} onSelect={() => setOpen(false)}>
                <span
                  className="block h-[0.9rem] w-[0.9rem] text-icon-rail"
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                {label}
                {label === "Export report" ? (
                  <CommandShortcut>⇧⌘E</CommandShortcut>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
