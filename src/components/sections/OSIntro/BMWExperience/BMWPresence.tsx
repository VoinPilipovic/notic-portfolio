"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { bmwImages } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";
import { chapterReveal } from "./motionHelpers";

interface BMWPresenceProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.presence;

/**
 * Chapter 08 - the slowest, most atmospheric beat before the finale. The
 * rear view arrives out of darkness; as the section scrolls, the fog-hero
 * frame gradually takes its place in the same spot - a literal crossfade,
 * not two separate images stacked in a row - so movement visibly settles
 * into stillness.
 */
export function BMWPresence({ scrollerRef, prefersReducedMotion }: BMWPresenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      chapterReveal(section, [labelRef.current, headingRef.current, bodyRef.current], scroller);

      if (!fogRef.current) return;
      if (prefersReducedMotion) {
        gsap.set(fogRef.current, { opacity: 0.6 });
        return;
      }
      gsap.fromTo(
        fogRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: section, scroller, start: "top 40%", end: "bottom 60%", scrub: 0.6 },
        }
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-center overflow-hidden bg-black">
      <Image
        src={bmwImages.rear}
        alt="The rear of a BMW receding into darkness, taillights still visible."
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div ref={fogRef} className="absolute inset-0 opacity-0">
        <Image src={bmwImages.fogHero} alt="" fill sizes="100vw" className="object-cover" aria-hidden />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 flex w-full flex-col gap-4 px-gutter">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="max-w-lg text-h1 font-bold leading-[1.1] text-foreground">
          {content.heading}
        </h2>
        <p ref={bodyRef} className="max-w-md text-body text-silver">
          {content.body}
        </p>
      </div>
    </section>
  );
}
