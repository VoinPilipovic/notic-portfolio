"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface BalanceSummaryProps {
  balance: number;
  status: "Active" | "Frozen";
  /** True once this session has already played the reveal once - the
   * Overview/Home tab unmounts and remounts every time the user switches
   * tabs and comes back, so without this a component-local ref can't tell
   * "just mounted for the first time" from "just mounted again after a
   * tab visit," and the balance would flash to €0.00 and re-count on every
   * single revisit. The owning shell tracks this across mounts. */
  skipEntranceAnimation?: boolean;
}

/** The balance figure counts up once per session on first reveal - a
 * premium, deliberate entrance rather than a static number appearing
 * instantly, but never repeated just because the user switched tabs. */
export function BalanceSummary({ balance, status, skipEntranceAnimation }: BalanceSummaryProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const lastValueRef = useRef(0);
  const isMountRef = useRef(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    const formatter = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
    const isMount = isMountRef.current;
    isMountRef.current = false;

    if (prefersReducedMotion || (isMount && skipEntranceAnimation)) {
      el.textContent = formatter.format(balance);
      lastValueRef.current = balance;
      return;
    }

    // Animates from wherever it last landed, not from zero - so a Send
    // Money update counts down to the new figure instead of the whole
    // balance flashing back to €0.00 and re-counting up every time.
    const counter = { value: lastValueRef.current };
    const tween = gsap.to(counter, {
      value: balance,
      duration: 1,
      delay: isMount ? 0.15 : 0,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = formatter.format(counter.value);
      },
      onComplete: () => {
        lastValueRef.current = balance;
      },
    });

    return () => {
      tween.kill();
    };
  }, [balance, prefersReducedMotion, isMountRef, skipEntranceAnimation]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Total Balance</span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 font-mono text-caption uppercase tracking-widest text-muted">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {status}
        </span>
      </div>
      <span
        ref={valueRef}
        className="font-mono tabular font-bold leading-[1.05] text-foreground"
        style={{ fontSize: "clamp(2.25rem, 1.9rem + 1.6vw, 2.75rem)" }}
      >
        €0.00
      </span>
    </div>
  );
}
