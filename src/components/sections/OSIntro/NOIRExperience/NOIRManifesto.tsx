"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { noirImages } from "./noirAssets";
import { noirChapters } from "./noirContent";
import { noirReveal } from "./noirMotion";

interface NOIRManifestoProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = noirChapters.idea;

// A narrow diagonal sliver widening into the full frame as the section
// scrolls - literally the beam of light in the photograph doing the
// revealing, rather than a generic fade or wipe.
const CLIP_NARROW = "polygon(46% 0%, 58% 0%, 40% 100%, 28% 100%)";
const CLIP_FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

/**
 * Chapter 01 - the philosophy stated in one sentence, surrounded by far
 * more emptiness than the copy needs. The image never simply appears; it's
 * let in, the way light finds its way into a dark room.
 */
export function NOIRManifesto({ scrollerRef, prefersReducedMotion }: NOIRManifestoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const shadowFrameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      noirReveal(section, [labelRef.current, headingRef.current, bodyRef.current], scroller, {
        stagger: 0.16,
        y: 18,
      });

      if (!frame) return;
      if (prefersReducedMotion) {
        gsap.set(frame, { clipPath: CLIP_FULL });
        return;
      }
      gsap.set(frame, { clipPath: CLIP_NARROW });
      gsap.to(frame, {
        clipPath: CLIP_FULL,
        ease: "none",
        scrollTrigger: { trigger: section, scroller, start: "top 88%", end: "bottom 35%", scrub: 1 },
      });

      noirReveal(section, [shadowFrameRef.current], scroller, { start: "top 55%", y: 22 });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-20 overflow-hidden bg-[#050505] px-gutter py-section"
    >
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="text-balance text-h2 font-bold leading-[1.15] text-foreground">
          {content.heading}
        </h2>
        <p ref={bodyRef} className="max-w-sm text-balance text-lead text-silver">
          {content.body}
        </p>
      </div>

      <div className="relative w-full max-w-md sm:max-w-2xl">
        <div ref={frameRef} className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10]">
          <Image
            src={noirImages.lightBeam}
            alt="A single diagonal beam of light crossing a black glass bottle of NOIR N°01 on dark stone."
            fill
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-cover"
          />
        </div>

        <div
          ref={shadowFrameRef}
          className="relative mt-4 aspect-[3/2] w-2/3 max-w-[16rem] overflow-hidden rounded-sm sm:absolute sm:-bottom-8 sm:-right-6 sm:mt-0 sm:w-56 sm:shadow-elevated"
        >
          <Image
            src={noirImages.diagonalShadow}
            alt="A sharp diagonal shadow cutting across a concrete surface."
            fill
            sizes="(min-width: 640px) 14rem, 60vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
