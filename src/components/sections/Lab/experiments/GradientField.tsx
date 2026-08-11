"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function GradientField() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const obj = { angle: 0 };
    const tween = gsap.to(obj, {
      angle: 360,
      duration: 22,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        el.style.background = `conic-gradient(from ${obj.angle}deg, rgba(76,130,176,0.5), rgba(111,163,204,0.25), rgba(76,130,176,0.5))`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div ref={ref} className="h-2/3 w-2/3 rounded-full" style={{ filter: "blur(4px)" }} />
    </div>
  );
}
