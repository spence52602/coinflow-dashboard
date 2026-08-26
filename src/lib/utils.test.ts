/**
 * Covers the class-name helper every component builds its className with.
 * The point of `cn` is not concatenation — it is that a later Tailwind class
 * beats an earlier conflicting one, which is what lets components accept a
 * `className` override at all.
 */
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("lets a later class win a Tailwind conflict", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("keeps non-conflicting classes", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("drops falsy values so conditionals can be inlined", () => {
    expect(cn("flex", false && "hidden", undefined, "gap-2")).toBe("flex gap-2");
  });
});
