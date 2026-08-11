"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { bmwImages, bmwVideos } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";
import { BMWMedia } from "./BMWMedia";
import { chapterReveal } from "./motionHelpers";

interface BMWInteriorProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.interior;

/**
 * Chapter 05 - quieter and more precise than the exterior chapters. The
 * cockpit video sits full-bleed but dimmed; a small layered detail card
 * (the interior still) floats over one edge rather than splitting the
 * screen 50/50, so the composition reads as depth, not a template.
 */
export function BMWInterior({ scrollerRef, prefersReducedMotion }: BMWInteriorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      chapterReveal(section, [labelRef.current, headingRef.current], scroller);

      if (!card) return;
      if (prefersReducedMotion) {
        gsap.set(card, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(card, { opacity: 0, y: 24 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "sine.out",
        scrollTrigger: { trigger: section, scroller, start: "top 65%", toggleActions: "play none none none" },
      });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-center overflow-hidden bg-[#050506]">
      <BMWMedia
        video={bmwVideos.interior}
        poster={bmwImages.interior}
        alt="The white digital cockpit of a BMW, driver-facing controls lit softly."
        scrollerRef={scrollerRef}
        prefersReducedMotion={prefersReducedMotion}
        className="absolute inset-0 h-full w-full opacity-70"
        sizes="100vw"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#050506]/35" />

      <div className="relative z-10 flex w-full max-w-content flex-col gap-10 px-gutter sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-sm flex-col gap-5">
          <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
            {content.label}
          </span>
          <h2 ref={headingRef} className="text-h1 font-bold leading-[1.1] text-foreground">
            {content.heading}
          </h2>
        </div>

        <div
          ref={cardRef}
          className="relative aspect-[4/3] w-full max-w-[19rem] shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-elevated sm:mb-2"
        >
          <Image
            src={bmwImages.interior}
            alt="Detail of the BMW cockpit's digital display and steering wheel."
            fill
            sizes="(min-width: 640px) 19rem, 80vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
