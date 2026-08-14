"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

/** A small, restrained toggle - no dramatic animation, just a fast position
 * and color transition. Native button + aria-checked so it's a real
 * accessible switch, not a styled checkbox hack. */
export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-[var(--duration-base)]",
        checked ? "border-accent/50 bg-accent-dim" : "border-border bg-surface-raised"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)]",
          checked ? "translate-x-5 bg-accent-hover" : "translate-x-0 bg-foreground/70"
        )}
      />
    </button>
  );
}
