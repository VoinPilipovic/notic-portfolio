"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface MagneticLinkProps {
  children: ReactNode;
  className?: string;
  /** How far the element leans toward the pointer, 0-1 of the raw offset. */
  strength?: number;
}

/**
 * A small, physical-feeling pull toward the pointer on hover-capable
 * devices - the interaction-category equivalent of a magnetic link. Skipped
 * entirely on touch (there's no hover to respond to) and reduced motion.
 */
export function MagneticLink({ children, className, strength = 0.28 }: MagneticLinkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.6, ease: "sine.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.6, ease: "sine.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    };
    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [prefersReducedMotion, strength]);

  return (
    <div ref={ref} className={cn("inline-block", className)}>
      {children}
    </div>
  );
}
