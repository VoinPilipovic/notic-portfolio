"use client";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { BMWDetails } from "./BMWDetails";
import { BMWExterior } from "./BMWExterior";
import { BMWFinale } from "./BMWFinale";
import { BMWHero } from "./BMWHero";
import { BMWInterior } from "./BMWInterior";
import { BMWLighting } from "./BMWLighting";
import { BMWMotion } from "./BMWMotion";
import { BMWPresence } from "./BMWPresence";
import { BMWVision } from "./BMWVision";

interface BMWExperienceProps {
  onBack: () => void;
  onClose: () => void;
}

/**
 * The full case study, mounted only once the window has expanded into it.
 * Everything scrolls inside its own container - never the page underneath -
 * so ProjectsWindow's existing header (Back/Close) stays the one persistent
 * control, and every chapter's ScrollTrigger targets this same scroller
 * instead of the window.
 */
export function BMWExperience({ onBack, onClose }: BMWExperienceProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      ref={scrollerRef}
      data-lenis-prevent
      className="relative h-full w-full overflow-y-auto overscroll-contain bg-black"
      style={{ scrollbarGutter: "stable" }}
    >
      <BMWHero scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWVision scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWExterior scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWMotion scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWInterior scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWLighting scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWDetails scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWPresence scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <BMWFinale scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} onBack={onBack} onClose={onClose} />
    </div>
  );
}
