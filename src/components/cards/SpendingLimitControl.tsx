"use client";

import { useEffect, useRef } from "react";
import { Minus, Plus } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, formatCurrency } from "@/lib/utils";

interface SpendingLimitControlProps {
  limit: number;
  spend: number;
  onChange: (next: number) => void;
}

const MIN = 200;
const MAX = 5000;
const STEP = 50;

/** A custom-styled native range input (real keyboard/screen-reader support,
 * no reinvented drag physics) plus +/- steppers, and a separate usage bar
 * that eases toward the new ratio whenever the limit changes. */
export function SpendingLimitControl({ limit, spend, onChange }: SpendingLimitControlProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const trackPercent = ((limit - MIN) / (MAX - MIN)) * 100;
  const usagePercent = Math.min(100, (spend / limit) * 100);
  const remaining = Math.max(0, limit - spend);
  const nearLimit = usagePercent >= 80;

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    if (prefersReducedMotion) {
      gsap.set(el, { scaleX: usagePercent / 100 });
      return;
    }
    const tween = gsap.to(el, { scaleX: usagePercent / 100, duration: 0.5, ease: "power3.out" });
    return () => {
      tween.kill();
    };
  }, [usagePercent, prefersReducedMotion]);

  const adjust = (delta: number) => onChange(Math.min(MAX, Math.max(MIN, limit + delta)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Monthly Limit</span>
        <span className="font-mono text-h2 tabular font-bold text-foreground">{formatCurrency(limit)}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => adjust(-STEP)}
          aria-label="Decrease spending limit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
        </button>

        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={limit}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Monthly spending limit"
          className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-accent-hover [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-accent-hover [&::-webkit-slider-thumb]:shadow-elevated"
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${trackPercent}%, var(--color-surface-raised) ${trackPercent}%, var(--color-surface-raised) 100%)`,
          }}
        />

        <button
          type="button"
          onClick={() => adjust(STEP)}
          aria-label="Increase spending limit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            ref={fillRef}
            className={cn("h-full origin-left rounded-full", nearLimit ? "bg-red-400/80" : "bg-accent")}
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="flex items-baseline justify-between font-mono text-caption text-muted">
          <span>
            Current spend <span className="tabular text-foreground">{formatCurrency(spend)}</span>
          </span>
          <span className="tabular">{formatCurrency(remaining)} remaining</span>
        </div>
      </div>
    </div>
  );
}
