"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";

import { BMWMedia as SceneMedia } from "../BMWExperience/BMWMedia";
import { noirImages, noirVideos } from "./noirAssets";
import { noirChapters } from "./noirContent";
import { noirReveal, sceneVeilReveal } from "./noirMotion";

interface NOIRArchitectureProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = noirChapters.architecture;

/**
 * Chapter 02 - the environment dwarfs the object on purpose. A single slow
 * scale is the only movement here; everything else about the scene holds
 * still, so the concrete and the light beam do the work BMW would spend on
 * a light sweep or a parallax layer. The frame itself still arrives out of
 * a held black veil rather than cutting straight in at full brightness.
 */
export function NOIRArchitecture({ scrollerRef, prefersReducedMotion }: NOIRArchitectureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      noirReveal(section, [labelRef.current, headingRef.current], scroller, { start: "top 62%" });
      sceneVeilReveal(section, veilRef.current, scroller);

      if (!media || prefersReducedMotion) return;
      gsap.fromTo(
        media,
        { scale: 1 },
        {
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: section, scroller, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-end overflow-hidden bg-black">
      <div ref={mediaRef} className="absolute inset-0 h-full w-full">
        <SceneMedia
          video={noirVideos.architecture}
          poster={noirImages.architecture}
          alt="A brutalist concrete corridor lit by a single diagonal beam, the NOIR N°01 bottle small on a stone pedestal."
          scrollerRef={scrollerRef}
          prefersReducedMotion={prefersReducedMotion}
          className="h-full w-full"
          sizes="100vw"
        />
      </div>
      {!prefersReducedMotion && <div ref={veilRef} aria-hidden className="pointer-events-none absolute inset-0 z-[2] bg-black" />}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 45%)" }}
      />

      <div className="relative z-10 flex w-full flex-col gap-5 px-gutter pb-20 sm:pb-24">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="max-w-lg text-balance text-h2 font-bold leading-[1.15] text-foreground">
          {content.heading}
        </h2>
      </div>
    </section>
  );
}
