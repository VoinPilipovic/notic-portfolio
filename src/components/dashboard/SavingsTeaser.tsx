import { ChevronRight, PiggyBank } from "lucide-react";

import type { SavingsGoal } from "@/types/banking";

interface SavingsTeaserProps {
  goals: SavingsGoal[];
  onOpen: () => void;
}

/** Savings isn't in the bottom nav (five items is already the max before
 * it feels crowded), so this is its entry point from Home - a compact,
 * static preview of the top goal, not a second animated chart. */
export function SavingsTeaser({ goals, onOpen }: SavingsTeaserProps) {
  const top = goals[0];
  if (!top) return null;
  const percent = Math.min(100, (top.current / top.target) * 100);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-3.5 rounded-lg border border-border bg-surface px-4 py-3.5 text-left transition-colors duration-[var(--duration-base)] hover:border-accent/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-raised text-accent-hover">
        <PiggyBank className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-small font-medium text-foreground">Savings Goals</span>
          <span className="font-mono text-caption tabular text-muted">{percent.toFixed(0)}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-raised">
          <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
    </button>
  );
}
