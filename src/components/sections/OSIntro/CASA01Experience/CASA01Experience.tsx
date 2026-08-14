"use client";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { CASA01Hero } from "./CASA01Hero";
import { CASA01Intro } from "./CASA01Intro";
import { CASA01Nav } from "./CASA01Nav";

interface CASA01ExperienceProps {
  onBack: () => void;
  onClose: () => void;
}

/**
 * CASA 01, phase 1 - hero and the first editorial section only. Shares
 * BMWExperience/NOIRExperience's own-scroll-container shape (chapters never
 * touch the page's Lenis instance; ScrollTrigger targets this scroller
 * directly, never the window) but earns its own pacing: a pinned cinematic
 * push on the hero rather than a video that plays and scrolls away, and its
 * own transparent-to-glass project nav rather than relying solely on
 * ProjectsWindow's shared title bar. `onClose` isn't used yet - kept on the
 * prop shape for parity with the sibling experiences and for when a Finale
 * chapter lands in phase 2.
 */
export function CASA01Experience({ onBack }: CASA01ExperienceProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      ref={scrollerRef}
      data-lenis-prevent
      className="relative h-full w-full overflow-y-auto overscroll-contain bg-black"
      style={{ scrollbarGutter: "stable" }}
    >
      <CASA01Nav scrollerRef={scrollerRef} boundaryRef={introSectionRef} onBack={onBack} />
      <CASA01Hero scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <CASA01Intro scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} sectionRef={introSectionRef} />
    </div>
  );
}
