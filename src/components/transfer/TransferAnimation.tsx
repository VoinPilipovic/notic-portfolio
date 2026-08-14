"use client";

import { useEffect, useRef } from "react";
import { Wallet } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatCurrency } from "@/lib/utils";
import type { Recipient } from "@/types/banking";

import { RecipientAvatar } from "./RecipientAvatar";

interface TransferAnimationProps {
  recipient: Recipient;
  amount: number;
  onComplete: () => void;
}

/**
 * The showcase moment: a value pulse detaching from the account, travelling
 * a clean linear path, and resolving on the recipient's side - a NOTIC
 * signal moving through the system, not flying banknotes or a crypto/neon
 * effect. ~1.1s, collapsing to a short state transition under reduced
 * motion.
 */
export function TransferAnimation({ recipient, amount, onComplete }: TransferAnimationProps) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const amountRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([lineFillRef.current], { scaleX: 1 });
        gsap.set(amountRef.current, { opacity: 0, y: 6 });
        const tl = gsap.timeline({ onComplete });
        tl.to(amountRef.current, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }).to({}, { duration: 0.2 });
        return;
      }

      gsap.set(lineFillRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(pulseRef.current, { left: "0%", opacity: 0, scale: 0.6 });
      gsap.set(ringRef.current, { opacity: 0, scale: 0.7 });
      gsap.set(amountRef.current, { opacity: 0, y: 6 });

      const tl = gsap.timeline({ onComplete });

      // Detach from source.
      tl.to(sourceRef.current, { scale: 1.08, duration: 0.12, ease: "power2.out" })
        .to(sourceRef.current, { scale: 1, duration: 0.16, ease: "power2.inOut" })
        .to(pulseRef.current, { opacity: 1, scale: 1, duration: 0.08 }, "<");

      // Travel - the line lights up progressively behind the pulse.
      tl.to(lineFillRef.current, { scaleX: 1, duration: 0.55, ease: "power1.inOut" }, "<")
        .to(pulseRef.current, { left: "100%", duration: 0.55, ease: "power1.inOut" }, "<")
        .to(pulseRef.current, { opacity: 0, duration: 0.1 }, "-=0.1");

      // Arrival - recipient activates, amount resolves.
      tl.to(targetRef.current, { scale: 1.1, duration: 0.13, ease: "power2.out" }, "-=0.06")
        .to(targetRef.current, { scale: 1, duration: 0.16, ease: "power2.inOut" })
        .fromTo(ringRef.current, { opacity: 0.6, scale: 0.75 }, { opacity: 0, scale: 1.7, duration: 0.42, ease: "power1.out" }, "<")
        .to(amountRef.current, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, "-=0.12");
    });

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative flex w-full max-w-xs items-center">
        <div
          ref={sourceRef}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface text-accent-hover"
        >
          <Wallet className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>

        <div className="relative mx-3 h-px flex-1 bg-border">
          <div
            ref={lineFillRef}
            className="absolute inset-0"
            style={{ background: "var(--color-accent-hover)", boxShadow: "0 0 6px 1px var(--color-accent-hover)" }}
          />
          <div
            ref={pulseRef}
            aria-hidden
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-hover"
            style={{ boxShadow: "0 0 10px 2px var(--color-accent-hover)" }}
          />
        </div>

        <div ref={targetRef} className="relative shrink-0">
          <span ref={ringRef} aria-hidden className="absolute inset-0 rounded-full border border-accent-hover" />
          <RecipientAvatar recipient={recipient} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span ref={amountRef} className="font-mono text-h1 font-bold tabular text-foreground">
          {formatCurrency(amount)}
        </span>
        <span className="font-mono text-caption uppercase tracking-widest text-muted">To {recipient.name}</span>
      </div>
    </div>
  );
}
