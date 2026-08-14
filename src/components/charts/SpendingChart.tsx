"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { SpendingCategory } from "@/types/banking";

interface SpendingChartProps {
  categories: SpendingCategory[];
  total: number;
}

// The top category gets the one accent; the rest step down through
// restrained graphite/ivory opacities - never a rainbow of category colors.
const BAR_TONES = ["bg-accent", "bg-foreground/55", "bg-foreground/35", "bg-foreground/20"];

/**
 * A compact preview, not a full analytics view - one animated bar per
 * category, drawn in once on mount.
 */
export function SpendingChart({ categories, total }: SpendingChartProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!bars.length) return;

    if (prefersReducedMotion) {
      gsap.set(bars, { scaleX: 1 });
      return;
    }

    gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
    const tween = gsap.to(bars, {
      scaleX: 1,
      duration: 0.8,
      delay: 0.2,
      stagger: 0.08,
      ease: "power3.out",
    });

    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Spending this month</span>
        <span className="font-mono text-small tabular text-foreground">
          €{total.toLocaleString("en-IE", { minimumFractionDigits: 0 })}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((entry, i) => (
          <div key={entry.category} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-small">
              <span className="text-foreground">{entry.category}</span>
              <span className="font-mono tabular text-muted">€{entry.amount}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
              <div
                ref={(el) => {
                  barsRef.current[i] = el;
                }}
                className={`h-full rounded-full ${BAR_TONES[i % BAR_TONES.length]}`}
                style={{ width: `${entry.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
