"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface IntroSequenceProps {
  onComplete: () => void;
}

/**
 * Near-black screen -> small mark -> a thin signal trace sweeps left to
 * right, constructing "NOTIC PAY" via a clip-path reveal (not particles,
 * not fog) -> a brief precision-lock (corner brackets snap in, one quick
 * brightness pulse) -> exits into Login. ~1.2-1.5s total, skipped down to a
 * fast plain fade under reduced motion.
 */
export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const restRef = useRef<HTMLSpanElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        const tl = gsap.timeline({ onComplete });
        tl.set([markRef.current, restRef.current], { opacity: 1, clipPath: "none" })
          .to(root, { opacity: 1, duration: 0.15 })
          .to(root, { opacity: 0, duration: 0.2, delay: 0.2 });
        return;
      }

      gsap.set(root, { opacity: 1 });
      gsap.set(markRef.current, { opacity: 0, y: 6 });
      gsap.set(restRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(scanRef.current, { left: "0%", opacity: 0 });
      gsap.set(bracketsRef.current, { opacity: 0, scale: 1.35 });

      const tl = gsap.timeline({ onComplete });

      // 1. The mark arrives alone.
      tl.to(markRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" });

      // 2. A thin signal trace sweeps across, constructing the rest of the
      // wordmark via a clip-path reveal - the scan line and the reveal
      // share the same duration/ease so they stay locked together.
      tl.to(scanRef.current, { opacity: 1, duration: 0.1 }, "-=0.05")
        .to(
          restRef.current,
          { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.inOut" },
          "<"
        )
        .to(scanRef.current, { left: "100%", duration: 0.5, ease: "power2.inOut" }, "<")
        .to(scanRef.current, { opacity: 0, duration: 0.12 }, "-=0.1");

      // 3. Precision lock - brackets snap tight, one quick brightness pulse.
      tl.to(bracketsRef.current, { opacity: 1, scale: 1, duration: 0.16, ease: "power3.out" }, "-=0.08")
        .to([markRef.current, restRef.current], { color: "var(--color-accent-hover)", duration: 0.08 }, "<")
        .to([markRef.current, restRef.current], { color: "var(--color-foreground)", duration: 0.14 }, "+=0.03")
        .to(bracketsRef.current, { opacity: 0, duration: 0.15 }, "+=0.05");

      // 4. Exit into Login.
      tl.to(root, { opacity: 0, filter: "blur(6px)", duration: 0.28, ease: "sine.in" }, "+=0.08");
    }, root);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-50 flex items-center justify-center bg-background opacity-0"
    >
      <div className="relative flex items-baseline">
        <span ref={markRef} className="font-display text-3xl font-bold tracking-tight text-foreground opacity-0">
          N
        </span>
        <span className="relative overflow-hidden">
          <span ref={restRef} className="font-display text-3xl font-bold tracking-tight text-foreground">
            OTIC PAY
          </span>
          <span
            ref={scanRef}
            aria-hidden
            className="absolute inset-y-0 w-px bg-accent-hover opacity-0"
            style={{ boxShadow: "0 0 8px 1px var(--color-accent-hover)" }}
          />
        </span>

        <div ref={bracketsRef} aria-hidden className="pointer-events-none absolute -inset-x-3 -inset-y-2.5 opacity-0">
          <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-accent" />
          <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-accent" />
          <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-accent" />
          <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-accent" />
        </div>
      </div>
    </div>
  );
}
