"use client";

import { motion } from "framer-motion";

import type { AnalyticsPeriod } from "@/types/banking";
import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
}

const PERIODS: { id: AnalyticsPeriod; label: string }[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "3months", label: "3 Months" },
  { id: "year", label: "Year" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Analytics period"
      className="flex items-center gap-1 rounded-full border border-border bg-surface p-1"
    >
      {PERIODS.map((period) => {
        const active = period.id === value;
        return (
          <button
            key={period.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(period.id)}
            className="relative flex-1 rounded-full px-1.5 py-2 text-center sm:px-3"
          >
            {active && (
              <motion.span
                layoutId="analytics-period-active"
                className="absolute inset-0 rounded-full bg-surface-raised"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 whitespace-nowrap font-mono text-caption uppercase tracking-wide transition-colors duration-[var(--duration-base)]",
                active ? "text-accent-hover" : "text-muted"
              )}
            >
              {period.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
