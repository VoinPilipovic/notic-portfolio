"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function DepthParallax() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card || prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const quickX = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "sine.out" });
    const quickY = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "sine.out" });

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      quickX(nx * 22);
      quickY(-ny * 22);
    };
    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center" style={{ perspective: "600px" }}>
      <div
        ref={cardRef}
        className="h-2/3 w-2/3 rounded-xl border border-border"
        style={{
          background: "linear-gradient(160deg, rgba(76,130,176,0.35), var(--color-surface))",
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
}
