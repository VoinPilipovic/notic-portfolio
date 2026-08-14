"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ProgressMeterProps {
  percent: number;
  pulse?: boolean;
}

const MILESTONES = [25, 50, 75];

/** A system-inspired meter, not a generic SaaS gradient bar: a hairline
 * track with milestone tick marks and a mono numeric readout. A brief
 * outward glow (no confetti) plays once when `pulse` turns on. */
export function ProgressMeter({ percent, pulse }: ProgressMeterProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const clamped = Math.min(100, Math.max(0, percent));

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    if (prefersReducedMotion) {
      gsap.set(el, { scaleX: clamped / 100 });
      return;
    }
    const tween = gsap.to(el, { scaleX: clamped / 100, duration: 0.6, ease: "power3.out" });
    return () => {
      tween.kill();
    };
  }, [clamped, prefersReducedMotion]);

  useEffect(() => {
    if (!pulse || prefersReducedMotion) return;
    const el = trackRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { boxShadow: "0 0 0 0 rgba(110,159,200,0.55)" },
      { boxShadow: "0 0 0 8px rgba(110,159,200,0)", duration: 0.7, ease: "power1.out" }
    );
    return () => {
      tween.kill();
    };
  }, [pulse, prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-1.5">
      <div ref={trackRef} className="relative h-2 w-full rounded-sm bg-surface-raised">
        <div className="absolute inset-0 overflow-hidden rounded-sm">
          <div
            ref={fillRef}
            className="absolute inset-0 origin-left rounded-sm bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        {MILESTONES.map((m) => (
          <span key={m} aria-hidden className="absolute top-0 h-full w-px bg-background/60" style={{ left: `${m}%` }} />
        ))}
      </div>
      <div className="flex items-center justify-between font-mono text-caption tabular text-muted">
        <span>{clamped.toFixed(0)}%</span>
        {pulse && <span className="text-accent-hover">Milestone reached</span>}
      </div>
    </div>
  );
}
