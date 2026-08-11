"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { bmwImages } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";
import { chapterReveal } from "./motionHelpers";

interface BMWDetailsProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.details;

/**
 * Chapter 07 - three images at three different ratios and weights, not a
 * three-card grid: one wide top-view banner, then a wheel macro and a low
 * cinematic diffuser strip sitting at deliberately uneven widths. The
 * fourth word from the brief ("Precision") closes the chapter as a standalone
 * line rather than being forced onto a fourth image that doesn't exist.
 */
export function BMWDetails({ scrollerRef, prefersReducedMotion }: BMWDetailsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      chapterReveal(section, [labelRef.current], scroller);

      const frames = frameRefs.current.filter(Boolean) as HTMLDivElement[];
      if (prefersReducedMotion) {
        gsap.set(frames, { opacity: 1, y: 0 });
        if (closingRef.current) gsap.set(closingRef.current, { opacity: 1 });
        return;
      }
      frames.forEach((frame, i) => {
        gsap.set(frame, { opacity: 0, y: 30 });
        gsap.to(frame, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: i * 0.08,
          ease: "sine.out",
          scrollTrigger: { trigger: frame, scroller, start: "top 85%", toggleActions: "play none none none" },
        });
      });
      if (closingRef.current) {
        gsap.set(closingRef.current, { opacity: 0 });
        gsap.to(closingRef.current, {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: closingRef.current, scroller, start: "top 90%", toggleActions: "play none none none" },
        });
      }
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#08090a] py-24">
      <div className="mx-auto flex w-full max-w-content flex-col gap-10 px-gutter">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
          {content.label}
        </span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div
            ref={(el) => {
              frameRefs.current[0] = el;
            }}
            className="relative col-span-1 aspect-[16/8] overflow-hidden rounded-sm sm:col-span-12 sm:aspect-[21/8]"
          >
            <Image
              src={bmwImages.topView}
              alt="A top-down view of the BMW's full silhouette."
              fill
              sizes="100vw"
              className="object-cover"
            />
            <span className="absolute left-6 top-6 font-mono text-caption uppercase tracking-widest text-white/80">
              {content.fragments[0]}
            </span>
          </div>

          <div
            ref={(el) => {
              frameRefs.current[1] = el;
            }}
            className="relative col-span-1 aspect-[3/4] overflow-hidden rounded-sm sm:col-span-5"
          >
            <Image
              src={bmwImages.wheel}
              alt="A macro detail of the BMW's forged wheel."
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-5 top-5 font-mono text-caption uppercase tracking-widest text-white/80">
              {content.fragments[1]}
            </span>
          </div>

          <div
            ref={(el) => {
              frameRefs.current[2] = el;
            }}
            className="relative col-span-1 aspect-[16/9] overflow-hidden rounded-sm sm:col-span-7 sm:self-end"
          >
            <Image
              src={bmwImages.diffuser}
              alt="A low, wide view of the BMW's rear diffuser and exhaust."
              fill
              sizes="(min-width: 640px) 55vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-5 top-5 font-mono text-caption uppercase tracking-widest text-white/80">
              {content.fragments[2]}
            </span>
          </div>
        </div>

        <span ref={closingRef} className="self-end font-mono text-caption uppercase tracking-[0.3em] text-muted">
          {content.fragments[3]}
        </span>
      </div>
    </section>
  );
}
