"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatCurrency } from "@/lib/utils";
import type { Recipient } from "@/types/banking";

interface SuccessStepProps {
  recipient: Recipient;
  amount: number;
  onDone: () => void;
}

export function SuccessStep({ recipient, amount, onDone }: SuccessStepProps) {
  const markRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !markRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        markRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.2)" }
      );
    });
    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <span
        ref={markRef}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/50 bg-accent-dim/50 text-accent-hover"
      >
        <Check className="h-7 w-7" strokeWidth={2.25} />
      </span>

      <div className="flex flex-col gap-1">
        <span className="font-mono text-h1 font-bold tabular text-foreground">{formatCurrency(amount)} Sent</span>
        <span className="font-mono text-caption uppercase tracking-widest text-muted">To {recipient.name}</span>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-4 flex h-13 w-full items-center justify-center rounded-md bg-accent font-medium text-background transition-colors duration-[var(--duration-base)] hover:bg-accent-hover"
      >
        Done
      </button>
    </div>
  );
}
