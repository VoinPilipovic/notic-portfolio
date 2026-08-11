"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { bmwImages, bmwVideos } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";
import { BMWMedia } from "./BMWMedia";
import { chapterReveal } from "./motionHelpers";

interface BMWExteriorProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.exterior;

/**
 * Chapter 03 - the exterior presented as sculpture. The studio video is the
 * dominant, slowly drifting visual (a held camera, not a cut); a light
 * sweep passes once as the chapter settles. The fog-hero frame that follows
 * is the chapter's own quieter close, not a repeat of the same shot.
 */
export function BMWExterior({ scrollerRef, prefersReducedMotion }: BMWExteriorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      chapterReveal(section, [labelRef.current, headingRef.current], scroller, {
        stagger: 0.1,
      });

      if (prefersReducedMotion) {
        if (media) gsap.set(media, { scale: 1 });
        if (fogRef.current) gsap.set(fogRef.current, { opacity: 1, scale: 1 });
        return;
      }

      if (media) {
        gsap.fromTo(
          media,
          { scale: 1 },
          {
            scale: 1.06,
            ease: "none",
            scrollTrigger: { trigger: section, scroller, start: "top bottom", end: "bottom top", scrub: 0.8 },
          }
        );
      }

      if (sweepRef.current) {
        gsap.fromTo(
          sweepRef.current,
          { xPercent: -130 },
          {
            xPercent: 220,
            ease: "none",
            scrollTrigger: { trigger: section, scroller, start: "top 60%", end: "top 5%", scrub: 0.6 },
          }
        );
      }

      if (fogRef.current) {
        gsap.fromTo(
          fogRef.current,
          { opacity: 0, scale: 1.04 },
          {
            opacity: 1,
            scale: 1,
            ease: "sine.out",
            duration: 1,
            scrollTrigger: { trigger: fogRef.current, scroller, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#050506]">
      <div className="relative flex h-screen min-h-screen w-full items-end overflow-hidden">
        <div ref={mediaRef} className="absolute inset-0 h-full w-full">
          <BMWMedia
            video={bmwVideos.studio}
            poster={bmwImages.studio}
            alt="A BMW slowly revealed under studio light against total darkness."
            scrollerRef={scrollerRef}
            prefersReducedMotion={prefersReducedMotion}
            className="h-full w-full"
            sizes="100vw"
          />
        </div>
        <div
          ref={sweepRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-1/4 -skew-x-12"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(to top, rgba(3,3,4,0.88) 0%, transparent 55%)" }}
        />

        <div className="relative z-10 flex w-full flex-col gap-4 px-gutter pb-16 sm:pb-20">
          <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
            {content.label}
          </span>
          <h2 className="max-w-2xl text-h1 font-bold leading-[1.1] text-foreground">
            <span ref={headingRef}>{content.heading}</span>
          </h2>
        </div>
      </div>

      <div ref={fogRef} className="relative h-[70vh] w-full overflow-hidden opacity-0">
        <Image
          src={bmwImages.fogHero}
          alt="The vehicle receding into a field of fog and diffused light."
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(5,5,6,0.5) 0%, transparent 30%, rgba(5,5,6,0.7) 100%)" }}
        />
        <span className="absolute bottom-8 left-gutter font-mono text-caption uppercase tracking-widest text-muted">
          Studio Reveal — 09
        </span>
      </div>
    </section>
  );
}
