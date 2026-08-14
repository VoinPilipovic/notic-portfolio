"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, formatCurrency } from "@/lib/utils";
import type { SavingsGoal } from "@/types/banking";

import { ProgressMeter } from "./ProgressMeter";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  pulse: boolean;
  onAdd: (goalId: string, amount: number) => void;
}

const PRESETS = [50, 100, 200];

/** Select goal (this card), enter amount, confirm - deliberately simpler
 * than Send Money's full transfer animation, per the brief. */
export function SavingsGoalCard({ goal, pulse, onAdd }: SavingsGoalCardProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const collapseTimeout = useRef<number | undefined>(undefined);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => window.clearTimeout(collapseTimeout.current);
  }, []);

  const percent = (goal.current / goal.target) * 100;
  const numeric = Number.parseFloat(amount || "0");
  const canConfirm = numeric > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onAdd(goal.id, numeric);
    setConfirmedAmount(numeric);
    setAmount("");
    window.clearTimeout(collapseTimeout.current);
    collapseTimeout.current = window.setTimeout(() => {
      setConfirmedAmount(null);
      setOpen(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-small font-bold text-foreground">{goal.title}</span>
          {goal.targetDate && (
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">By {goal.targetDate}</span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-small tabular font-semibold text-foreground">{formatCurrency(goal.current)}</span>
          <span className="font-mono text-[0.65rem] tabular text-muted">of {formatCurrency(goal.target)}</span>
        </div>
      </div>

      <ProgressMeter percent={percent} pulse={pulse} />

      <AnimatePresence mode="wait" initial={false}>
        {confirmedAmount !== null ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-md border border-accent/30 bg-accent-dim/40 px-3 py-2.5 text-small text-accent-hover"
          >
            <Check className="h-4 w-4" strokeWidth={2} />
            Added {formatCurrency(confirmedAmount)} to {goal.title}
          </motion.div>
        ) : open ? (
          <motion.div
            key="entry"
            initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(preset))}
                  className={cn(
                    "flex-1 rounded-md border py-2 font-mono text-small tabular transition-colors duration-[var(--duration-base)]",
                    amount === String(preset)
                      ? "border-accent/50 bg-accent-dim/40 text-accent-hover"
                      : "border-border text-foreground hover:border-accent/30"
                  )}
                >
                  +€{preset}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                placeholder="Custom amount"
                aria-label={`Amount to add to ${goal.title}`}
                className="h-11 flex-1 rounded-md border border-border bg-background px-3 font-mono text-small tabular text-foreground placeholder:text-muted focus:border-accent"
              />
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="flex h-11 items-center justify-center rounded-md bg-accent px-4 font-medium text-background transition-colors duration-[var(--duration-base)] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 font-mono text-caption uppercase tracking-widest text-foreground transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add money
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
