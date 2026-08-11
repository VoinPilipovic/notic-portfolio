"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CursorLightbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow || prefersReducedMotion) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 0.4, ease: "sine.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.4, ease: "sine.out" });

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      quickX(event.clientX - rect.left);
      quickY(event.clientY - rect.top);
    };

    container.addEventListener("pointermove", onMove);
    return () => container.removeEventListener("pointermove", onMove);
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(76,130,176,0.55), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
