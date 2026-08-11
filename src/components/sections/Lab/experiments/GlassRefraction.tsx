"use client";

import { useEffect, useId, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function GlassRefraction() {
  const filterId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const displace = displaceRef.current;
    if (!container || !displace || prefersReducedMotion) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const enter = () => gsap.to(displace, { attr: { scale: 45 }, duration: 0.6, ease: "sine.out" });
    const leave = () => gsap.to(displace, { attr: { scale: 0 }, duration: 0.6, ease: "sine.inOut" });
    container.addEventListener("pointerenter", enter);
    container.addEventListener("pointerleave", leave);
    return () => {
      container.removeEventListener("pointerenter", enter);
      container.removeEventListener("pointerleave", leave);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves={2} seed={4} result="noise" />
          <feDisplacementMap ref={displaceRef} in="SourceGraphic" in2="noise" scale={0} />
        </filter>
      </svg>
      <div
        className="h-3/4 w-3/4 rounded-xl"
        style={{
          filter: `url(#${filterId})`,
          background: "linear-gradient(135deg, rgba(76,130,176,0.6), rgba(111,163,204,0.3))",
        }}
      />
    </div>
  );
}
