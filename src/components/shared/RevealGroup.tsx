"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each direct child's reveal. */
  stagger?: number;
  /** Starting vertical offset in px before the child settles to rest. */
  y?: number;
  /** ScrollTrigger start position for the group as a whole. */
  start?: string;
}

/**
 * Staggers each direct child in (blur+fade+y, once) as the group scrolls
 * into view - the shared mechanism behind every list-like reveal on the
 * site (timeline entries, capability rows, workflow steps, project
 * chapters) so none of them are hand-rolled per section.
 */
export function RevealGroup({ children, className, stagger = 0.08, y = 20, start = "top 82%" }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        items,
        { opacity: 0, y, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger,
          ease: "sine.out",
          scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => context.revert();
  }, [prefersReducedMotion, stagger, y, start]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
