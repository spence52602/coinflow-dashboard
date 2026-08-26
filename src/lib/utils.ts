/**
 * The class-name helper every component composes its className with.
 *
 * clsx flattens conditionals; twMerge then resolves Tailwind conflicts so a
 * later class beats an earlier one — which is what makes a `className` prop
 * able to override a component's own defaults.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
