"use client";

import { useEffect, useRef, useState } from "react";

import { formatCurrency } from "@/lib/utils";
import type { SavingsGoal } from "@/types/banking";

import { SavingsGoalCard } from "./SavingsGoalCard";

interface SavingsViewProps {
  goals: SavingsGoal[];
  onGoalsChange: (next: SavingsGoal[]) => void;
}

const MILESTONES = [25, 50, 75, 100];

function crossedMilestone(prevPercent: number, nextPercent: number) {
  return MILESTONES.some((m) => prevPercent < m && nextPercent >= m);
}

/** Clear progress + a useful goal interaction - the one reason this page
 * exists. Goal state is lifted to the dashboard shell (same pattern as
 * balance/transactions) so progress survives switching tabs mid-session. */
export function SavingsView({ goals, onGoalsChange }: SavingsViewProps) {
  const [pulsingId, setPulsingId] = useState<string | null>(null);
  const pulseTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(pulseTimeout.current);
  }, []);

  const handleAdd = (goalId: string, amount: number) => {
    let crossed = false;
    const next = goals.map((g) => {
      if (g.id !== goalId) return g;
      const prevPercent = (g.current / g.target) * 100;
      const nextCurrent = Math.min(g.target, g.current + amount);
      const nextPercent = (nextCurrent / g.target) * 100;
      if (crossedMilestone(prevPercent, nextPercent)) crossed = true;
      return { ...g, current: nextCurrent };
    });
    onGoalsChange(next);
    if (crossed) {
      window.clearTimeout(pulseTimeout.current);
      setPulsingId(goalId);
      pulseTimeout.current = window.setTimeout(() => setPulsingId(null), 1200);
    }
  };

  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  return (
    <div className="flex flex-col gap-8 pb-2">
      <div className="flex flex-col gap-1">
        <span className="font-display text-h1 font-bold text-foreground">Savings</span>
        <span className="text-small text-muted">
          {goals.length} active goals · {formatCurrency(totalCurrent)} of {formatCurrency(totalTarget)}
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => (
          <SavingsGoalCard key={goal.id} goal={goal} pulse={goal.id === pulsingId} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}
