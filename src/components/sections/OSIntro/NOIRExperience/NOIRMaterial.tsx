"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { BMWMedia as SceneMedia } from "../BMWExperience/BMWMedia";
import { noirImages, noirVideos } from "./noirAssets";
import { noirChapters } from "./noirContent";
import { noirReveal, sceneVeilReveal } from "./noirMotion";

interface NOIRMaterialProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = noirChapters.material;

/**
 * Chapter 03 - an editorial pairing, not a gallery: one dominant macro
 * frame with a smaller supporting crop offset against it, each carrying
 * only a small technical label. No carousel, no equal-weight grid.
 */
export function NOIRMaterial({ scrollerRef, prefersReducedMotion }: NOIRMaterialProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const primaryVeilRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const tertiaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      noirReveal(section, [labelRef.current, headingRef.current], scroller, { start: "top 75%" });
      noirReveal(section, [primaryRef.current], scroller, { start: "top 72%", y: 32 });
      sceneVeilReveal(section, primaryVeilRef.current, scroller, { start: "top 78%", end: "top 32%" });
      noirReveal(section, [secondaryRef.current], scroller, { start: "top 58%", y: 32 });
      noirReveal(section, [tertiaryRef.current], scroller, { start: "top 48%", y: 32 });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#08090a] py-28">
      <div className="mx-auto flex w-full max-w-content flex-col gap-14 px-gutter">
        <div className="flex flex-col gap-5">
          <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-muted">
            {content.label}
          </span>
          <h2 ref={headingRef} className="max-w-lg text-balance text-h1 font-bold leading-[1.1] text-foreground">
            {content.heading}
          </h2>
        </div>

        <div className="relative">
          <div ref={primaryRef} className="relative aspect-[4/3] w-full overflow-hidden rounded-sm sm:aspect-[16/9]">
            <SceneMedia
              video={noirVideos.macro}
              poster={noirImages.liquidDetail}
              alt="Extreme macro detail of the NOIR N°01 fragrance liquid and black glass."
              scrollerRef={scrollerRef}
              prefersReducedMotion={prefersReducedMotion}
              className="h-full w-full"
              sizes="(min-width: 640px) 60vw, 100vw"
            />
            {!prefersReducedMotion && (
              <div ref={primaryVeilRef} aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-black" />
            )}
            <span className="absolute left-5 top-5 font-mono text-caption uppercase tracking-widest text-white/70">
              {content.fragments[1]}
            </span>
          </div>

          <div
            ref={secondaryRef}
            className="relative mt-6 aspect-[3/4] w-2/3 max-w-xs overflow-hidden rounded-sm sm:absolute sm:-bottom-10 sm:left-8 sm:mt-0 sm:w-64 sm:shadow-elevated"
          >
            <Image
              src={noirImages.macroGlass}
              alt="Macro detail of the NOIR N°01 bottle's black glass surface."
              fill
              sizes="(min-width: 640px) 16rem, 60vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 font-mono text-caption uppercase tracking-widest text-white/70">
              {content.fragments[0]}
            </span>
          </div>

          <div
            ref={tertiaryRef}
            className="relative mt-4 aspect-[4/3] w-1/2 max-w-[14rem] overflow-hidden rounded-sm sm:absolute sm:-top-8 sm:right-4 sm:mt-0 sm:w-48 sm:shadow-elevated"
          >
            <Image
              src={noirImages.wetStone}
              alt="Wet dark stone surface, catching a thin reflection of light."
              fill
              sizes="(min-width: 640px) 12rem, 50vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 font-mono text-caption uppercase tracking-widest text-white/70">
              {content.fragments[2]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
