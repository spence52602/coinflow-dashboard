"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleGroupItemVariants = cva(
  "rounded-control font-sans font-medium tracking-[-0.005em] transition-none data-[state=on]:bg-solid",
  {
    variants: {
      variant: {
        /* The chart's range control — geometry matches the comp exactly. */
        segment:
          "px-[0.6875rem] py-1.5 text-xs leading-[normal] text-seg-idle data-[state=on]:text-ink",
      },
    },
    defaultVariants: { variant: "segment" },
  },
);

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("flex", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
