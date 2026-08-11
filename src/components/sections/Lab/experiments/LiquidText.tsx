"use client";

import { useEffect, useId, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function LiquidText() {
  const filterId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const displace = displaceRef.current;
    if (!container || !displace || prefersReducedMotion) return;

    const enter = () => gsap.to(displace, { attr: { scale: 26 }, duration: 0.5, ease: "sine.out" });
    const leave = () => gsap.to(displace, { attr: { scale: 0 }, duration: 0.7, ease: "sine.inOut" });
    container.addEventListener("pointerenter", enter);
    container.addEventListener("pointerleave", leave);
    return () => {
      container.removeEventListener("pointerenter", enter);
      container.removeEventListener("pointerleave", leave);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center">
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves={2} seed={9} result="noise" />
          <feDisplacementMap ref={displaceRef} in="SourceGraphic" in2="noise" scale={0} />
        </filter>
      </svg>
      <p className="text-h3 font-bold text-foreground" style={{ filter: `url(#${filterId})` }}>
        fluid
      </p>
    </div>
  );
}
