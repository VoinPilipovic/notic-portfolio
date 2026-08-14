"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { cn, formatCurrency } from "@/lib/utils";
import type { AnalyticsCategoryBreakdown } from "@/types/banking";

interface CategoryBreakdownProps {
  categories: AnalyticsCategoryBreakdown[];
}

/** Selecting a chip doesn't reshape the main chart (that would need a full
 * per-category time series this demo doesn't model) - it updates this
 * secondary total/percentage readout, which is the part of the brief this
 * interaction actually needs to satisfy. */
export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [selected, setSelected] = useState<string | null>(categories[0]?.category ?? null);
  const active = categories.find((c) => c.category === selected) ?? categories[0];

  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-caption uppercase tracking-widest text-muted">By Category</span>

      <div className="flex flex-wrap gap-2">
        {categories.map((entry) => {
          const isActive = entry.category === active?.category;
          return (
            <button
              key={entry.category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(entry.category)}
              className={cn(
                "relative overflow-hidden rounded-full border px-3.5 py-2 font-mono text-caption uppercase tracking-widest transition-colors duration-[var(--duration-base)]",
                isActive ? "border-accent/50 text-accent-hover" : "border-border text-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="category-active-bg"
                  className="absolute inset-0 -z-10 bg-accent-dim/50"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              {entry.category}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-small font-medium text-foreground">{active.category}</span>
            <span className="font-mono text-caption text-muted">{active.percent}% of total spend</span>
          </div>
          <span className="font-mono text-h2 tabular font-bold text-foreground">{formatCurrency(active.amount)}</span>
        </div>
      )}
    </div>
  );
}
