"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { bmwImages } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";

interface BMWVisionProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.vision;

/**
 * Chapter 02 - the launch-stage photograph fills most of the frame like an
 * actual keynote backdrop, with copy held in a narrow architectural column
 * rather than a card floating on top of it. The image arrives through a
 * clip-path wipe (a curtain lifting), not a fade or scale.
 */
export function BMWVision({ scrollerRef, prefersReducedMotion }: BMWVisionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const textTargets = [labelRef.current, headingRef.current, bodyRef.current];
      if (prefersReducedMotion) {
        gsap.set(textTargets, { opacity: 1, y: 0, filter: "blur(0px)" });
        if (frame) gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      gsap.set(textTargets, { opacity: 0, y: 20, filter: "blur(10px)" });
      if (frame) gsap.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, scroller: scrollerRef.current, start: "top 75%", end: "top 30%", scrub: 0.7 },
      });
      if (frame) tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0);

      gsap.to(textTargets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.1,
        ease: "sine.out",
        scrollTrigger: { trigger: section, scroller: scrollerRef.current, start: "top 68%", toggleActions: "play none none none" },
      });

      if (frame) {
        gsap.to(frame, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scroller: scrollerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#08090a] sm:items-center sm:py-24"
    >
      {/* Desktop: the photograph fills the right 68% behind the text column.
          Mobile: no overlap at all - a plain portrait crop stacked above the
          copy, since the desktop's horizontal contrast gradient can't carry
          a full-width image with text on top of it without going unreadable. */}
      <div
        ref={frameRef}
        className="relative h-[46vh] w-full overflow-hidden sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto sm:w-[68%]"
      >
        <Image
          src={bmwImages.launchStage}
          alt="A BMW illuminated on a launch stage, presented like a keynote reveal."
          fill
          sizes="(min-width: 640px) 68vw, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 sm:hidden"
          style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(8,9,10,0.95) 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{ background: "linear-gradient(90deg, rgba(8,9,10,0.85) 0%, transparent 34%)" }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-content flex-1 items-center px-gutter py-10 sm:py-0">
        <div className="flex max-w-sm flex-col gap-6 border-l border-white/10 pl-6 sm:pl-8">
          <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
            {content.label}
          </span>
          <h2 ref={headingRef} className="text-h1 font-bold leading-[1.1] text-foreground">
            {content.heading}
          </h2>
          <p ref={bodyRef} className="text-body text-silver">
            {content.body}
          </p>
        </div>
      </div>
    </section>
  );
}
