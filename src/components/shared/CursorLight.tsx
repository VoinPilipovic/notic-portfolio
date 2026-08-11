"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The one site-wide "living light" primitive: a soft navy field that
 * leans gently toward the pointer and breathes brighter for a moment when
 * the page is scrolled quickly. This is what keeps every scene feeling like
 * the same physical room rather than a stack of independent sections - the
 * light source doesn't reset at each scene boundary, it just keeps existing.
 * Mounted once in the root layout, always below page content.
 */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const quickX = gsap.quickTo(el, "xPercent", { duration: 1.4, ease: "sine.out" });
    const quickY = gsap.quickTo(el, "yPercent", { duration: 1.4, ease: "sine.out" });
    const quickOpacity = gsap.quickTo(el, "opacity", { duration: 0.5, ease: "sine.out" });

    gsap.set(el, { opacity: 0.045 });

    let cleanupPointer = () => {};
    if (canHover) {
      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        quickX(nx * 18);
        quickY(ny * 18);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanupPointer = () => window.removeEventListener("pointermove", onMove);
    }

    // Scroll velocity is what makes the light feel like it belongs to a
    // physical room with inertia - it brightens a touch when you move
    // through the space quickly and settles the instant you stop.
    let lastY = window.scrollY;
    let lastT = performance.now();
    let settleTimer: number | undefined;
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = Math.max(now - lastT, 1);
      const velocity = Math.min(Math.abs(dy / dt), 3);
      lastY = window.scrollY;
      lastT = now;

      quickOpacity(0.045 + velocity * 0.06);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => quickOpacity(0.045), 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cleanupPointer();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{
        opacity: prefersReducedMotion ? 0.04 : 0,
        background:
          "radial-gradient(ellipse 42% 38% at 50% 40%, rgba(76,130,176,0.5), transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
