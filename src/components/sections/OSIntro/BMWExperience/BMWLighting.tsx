"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";

import { bmwImages, bmwVideos } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";
import { BMWMedia } from "./BMWMedia";
import { BMW_BLUE, chapterReveal } from "./motionHelpers";

interface BMWLightingProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.lighting;
const MARKERS = [
  { label: "Optic Array", top: "28%", left: "38%" },
  { label: "Signal Path", top: "58%", left: "62%" },
];

/**
 * Chapter 06 - dark, macro, minimal. The headlight itself stays the only
 * subject; the two markers are abstract design annotations (not factual
 * BMW engineering claims), and the one restrained blue accent in the whole
 * experience lives here, where it reads as a signature rather than decor.
 */
export function BMWLighting({ scrollerRef, prefersReducedMotion }: BMWLightingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      chapterReveal(section, [labelRef.current, headingRef.current], scroller);

      const markers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (prefersReducedMotion) {
        gsap.set(markers, { opacity: 1 });
        return;
      }
      gsap.set(markers, { opacity: 0 });
      gsap.to(markers, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.3,
        ease: "sine.out",
        scrollTrigger: { trigger: section, scroller, start: "top 60%", toggleActions: "play none none none" },
      });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-center overflow-hidden bg-black">
      <BMWMedia
        video={bmwVideos.headlight}
        poster={bmwImages.headlight}
        alt="A macro view of a BMW headlight signature, lit against darkness."
        scrollerRef={scrollerRef}
        prefersReducedMotion={prefersReducedMotion}
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 55% at 45% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
      />

      {MARKERS.map((marker, i) => (
        <div
          key={marker.label}
          ref={(el) => {
            markerRefs.current[i] = el;
          }}
          className="absolute z-10 flex items-center gap-2"
          style={{ top: marker.top, left: marker.left }}
        >
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: BMW_BLUE }} />
          <span className="font-mono text-caption uppercase tracking-widest" style={{ color: BMW_BLUE }}>
            {marker.label}
          </span>
        </div>
      ))}

      <div className="relative z-10 flex w-full flex-col gap-4 px-gutter">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="max-w-lg text-h1 font-bold leading-[1.1] text-foreground">
          {content.heading}
        </h2>
      </div>
    </section>
  );
}
