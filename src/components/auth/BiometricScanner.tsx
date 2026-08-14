"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface BiometricScannerProps {
  onVerified: () => void;
}

// An abstract ring of system points, not a face outline - deliberately not
// an eyes/nose/mouth arrangement, so this reads as a NOTIC sensor grid
// rather than a copy of Apple's Face ID mark.
const POINTS = [
  { x: "14%", y: "22%" },
  { x: "50%", y: "8%" },
  { x: "86%", y: "24%" },
  { x: "18%", y: "72%" },
  { x: "50%", y: "88%" },
  { x: "82%", y: "68%" },
];

/**
 * A fast, original NOTIC biometric beat - dim, a compact bracketed frame,
 * one quick scan pulse, points reacting, a check-mark lock. Total runtime
 * ~0.75s (reduced motion: ~0.25s, no scan travel). Calls `onVerified` at the
 * very end of its own exit fade, so the caller can swap views immediately
 * with no visible pop.
 */
export function BiometricScanner({ onVerified }: BiometricScannerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const statusRef = useRef<HTMLSpanElement>(null);
  const checkWrapRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        const tl = gsap.timeline({ onComplete: onVerified });
        tl.set(root, { opacity: 1 })
          .set(frameRef.current, { opacity: 1, scale: 1 })
          .set(dotsRef.current, { opacity: 0.7, scale: 1 })
          .set(statusRef.current, { opacity: 1 })
          .to({}, { duration: 0.1 })
          .set(checkWrapRef.current, { opacity: 1, scale: 1 })
          .to({}, { duration: 0.1 })
          .to(root, { opacity: 0, duration: 0.15 });
        return;
      }

      gsap.set(root, { opacity: 0 });
      gsap.set(frameRef.current, { opacity: 0, scale: 0.85 });
      gsap.set(scanLineRef.current, { opacity: 0, top: "6%" });
      gsap.set(dotsRef.current, { opacity: 0.2, scale: 0.7 });
      gsap.set(checkWrapRef.current, { opacity: 0, scale: 0.5 });
      gsap.set(statusRef.current, { opacity: 0 });

      // Every tween below is placed at an absolute timeline position (not
      // "<"/"+=" chaining) specifically so the total runtime is exact and
      // verifiable - the brief caps this at ~1s and that's a hard budget,
      // not a rough feel.
      const tl = gsap.timeline({ onComplete: onVerified });

      // Open (0 - 0.13s): dim in, frame arrives.
      tl.to(root, { opacity: 1, duration: 0.1, ease: "power1.out" }, 0)
        .to(frameRef.current, { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out" }, 0)
        .to(statusRef.current, { opacity: 1, duration: 0.08 }, 0.05);

      // Scan (0.12 - 0.40s): one fast pulse down the frame, points react.
      tl.to(scanLineRef.current, { opacity: 1, duration: 0.03 }, 0.12)
        .to(scanLineRef.current, { top: "94%", duration: 0.22, ease: "power1.inOut" }, 0.12)
        .to(dotsRef.current, { opacity: 1, scale: 1.15, duration: 0.12, stagger: 0.015, ease: "power2.out" }, 0.14)
        .to(dotsRef.current, { opacity: 0.55, scale: 1, duration: 0.1, stagger: 0.01 }, 0.3)
        .to(scanLineRef.current, { opacity: 0, duration: 0.06 }, 0.34);

      // Verified (0.40 - 0.56s): brief lock beat.
      tl.call(
        () => {
          if (statusRef.current) statusRef.current.textContent = "Identity Verified";
        },
        [],
        0.4
      )
        .to(frameRef.current, { borderColor: "var(--color-accent)", duration: 0.06 }, 0.4)
        .to(checkWrapRef.current, { opacity: 1, scale: 1, duration: 0.14, ease: "back.out(2.4)" }, 0.42)
        .to(statusRef.current, { color: "var(--color-accent-hover)", duration: 0.08 }, 0.42);

      // Exit into the dashboard (0.60 - 0.80s total).
      tl.to(root, { opacity: 0, duration: 0.2, ease: "sine.in" }, 0.6);
    }, root);

    // .kill() (not .revert()) - this component is about to be fully
    // unmounted, so there's no point paying to restore original inline
    // styles on elements that are seconds from being thrown away.
    return () => context.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-background/85 opacity-0"
    >
      <div
        ref={frameRef}
        className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-border opacity-0"
      >
        <span className="absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l border-t border-accent/70" />
        <span className="absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r border-t border-accent/70" />
        <span className="absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b border-l border-accent/70" />
        <span className="absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-b border-r border-accent/70" />

        <div className="relative h-16 w-16">
          {POINTS.map((p, i) => (
            <span
              key={i}
              ref={(el) => {
                dotsRef.current[i] = el;
              }}
              aria-hidden
              className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-hover"
              style={{ left: p.x, top: p.y }}
            />
          ))}
        </div>

        <div
          ref={scanLineRef}
          aria-hidden
          className="absolute inset-x-4 h-px bg-accent-hover opacity-0"
          style={{ boxShadow: "0 0 6px 1px var(--color-accent-hover)" }}
        />

        <span
          ref={checkWrapRef}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 opacity-0"
        >
          <Check className="h-7 w-7 text-accent-hover" strokeWidth={2.25} />
        </span>
      </div>

      <span ref={statusRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted opacity-0">
        Verifying
      </span>
    </div>
  );
}
