"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const WORD = "NOTIC";

export function MagneticType() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const quicks = letters.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.5, ease: "sine.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.5, ease: "sine.out" }),
    }));

    const onMove = (event: PointerEvent) => {
      letters.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const pull = Math.max(0, 1 - dist / 140);
        quicks[i].x(-dx * pull * 0.4);
        quicks[i].y(-dy * pull * 0.4);
      });
    };
    const onLeave = () => {
      quicks.forEach(({ x, y }) => {
        x(0);
        y(0);
      });
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center">
      <p className="flex text-h2 font-bold text-foreground">
        {WORD.split("").map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block"
          >
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}
