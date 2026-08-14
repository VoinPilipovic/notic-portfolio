"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { CardDetails, PaymentCardData } from "@/types/banking";

interface CardDetailsRevealProps {
  card: PaymentCardData;
  details: CardDetails;
}

const AUTO_HIDE_SECONDS = 6;

/** Privacy-aware reveal: hidden by default, one explicit tap to show, and
 * an automatic hide a few seconds later (shown as a draining bar, not a
 * ticking counter, so nothing re-renders every second). */
export function CardDetailsReveal({ card, details }: CardDetailsRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const timerFillRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<number | undefined>(undefined);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => window.clearTimeout(hideTimeout.current);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    window.clearTimeout(hideTimeout.current);
    hideTimeout.current = window.setTimeout(() => setRevealed(false), AUTO_HIDE_SECONDS * 1000);

    const el = timerFillRef.current;
    if (!el) return;
    gsap.set(el, { scaleX: 1 });
    const tween = gsap.to(el, {
      scaleX: 0,
      duration: prefersReducedMotion ? 0.01 : AUTO_HIDE_SECONDS,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [revealed, prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Card Details</span>
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-caption uppercase tracking-widest text-foreground transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
        >
          {revealed ? (
            <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
          {revealed ? "Hide" : "View details"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/80">Card Number</span>
          <span className="font-mono text-body tabular tracking-[0.12em] text-foreground">
            {revealed ? details.numberFull : card.numberMasked}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/80">Expiry</span>
          <span className="font-mono text-small tabular text-foreground">{card.expiry}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/80">CVV</span>
          <span className="font-mono text-small tabular text-foreground">{revealed ? details.cvv : "•••"}</span>
        </div>
      </div>

      {revealed && (
        <div aria-hidden className="h-0.5 w-full overflow-hidden rounded-full bg-surface-raised">
          <div ref={timerFillRef} className="h-full origin-left rounded-full bg-accent" />
        </div>
      )}

      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
        Concept / Demo data — not a real card
      </p>
    </div>
  );
}
