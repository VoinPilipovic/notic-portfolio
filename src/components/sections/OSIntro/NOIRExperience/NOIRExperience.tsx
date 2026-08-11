"use client";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { NOIRArchitecture } from "./NOIRArchitecture";
import { NOIRDetails } from "./NOIRDetails";
import { NOIRFinale } from "./NOIRFinale";
import { NOIRHero } from "./NOIRHero";
import { NOIRHuman } from "./NOIRHuman";
import { NOIRManifesto } from "./NOIRManifesto";
import { NOIRMaterial } from "./NOIRMaterial";

interface NOIRExperienceProps {
  onBack: () => void;
  onClose: () => void;
}

/**
 * NOIR N°01's full case study - architecturally a sibling of BMWExperience
 * (same internal-scroll-container pattern, same chapter-per-file shape),
 * but its own visual and motion system: near-black/charcoal/soft-white
 * only, slower and heavier pacing, far more stillness. BMW moves; NOIR
 * waits.
 */
export function NOIRExperience({ onBack, onClose }: NOIRExperienceProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      ref={scrollerRef}
      data-lenis-prevent
      className="relative h-full w-full overflow-y-auto overscroll-contain bg-black"
      style={{ scrollbarGutter: "stable" }}
    >
      <NOIRHero scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <NOIRManifesto scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <NOIRArchitecture scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <NOIRMaterial scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <NOIRHuman scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <NOIRDetails scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} />
      <NOIRFinale scrollerRef={scrollerRef} prefersReducedMotion={prefersReducedMotion} onBack={onBack} onClose={onClose} />
    </div>
  );
}
