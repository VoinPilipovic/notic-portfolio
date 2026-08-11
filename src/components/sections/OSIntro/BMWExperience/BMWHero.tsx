"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";

import { bmwImages, bmwVideos } from "./bmwAssets";
import { bmwMeta } from "./bmwContent";
import { BMWMedia } from "./BMWMedia";

interface BMWHeroProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const METADATA = [
  { label: "Role", value: bmwMeta.role },
  { label: "Year", value: bmwMeta.year },
  { label: "Status", value: bmwMeta.status },
  { label: "Stack", value: bmwMeta.stack },
];

/**
 * Chapter 01 - the tunnel video fills the canvas immediately. Content plays
 * once on mount (this is the first thing the visitor sees the instant the
 * entry veil clears, not something waiting on scroll), then settles - no
 * further movement until the visitor scrolls.
 */
export function BMWHero({ scrollerRef, prefersReducedMotion }: BMWHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const standfirstRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const targets = [kickerRef.current, headlineRef.current, standfirstRef.current, metaRef.current, cueRef.current];
      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 18, filter: "blur(12px)" });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.12,
        delay: 0.15,
        ease: "sine.out",
      });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-end overflow-hidden bg-[#050506]">
      <BMWMedia
        video={bmwVideos.tunnel}
        poster={bmwImages.tunnel}
        alt="A BMW driving through an illuminated tunnel, motion blurred into streaks of light."
        scrollerRef={scrollerRef}
        prefersReducedMotion={prefersReducedMotion}
        className="absolute inset-0 z-0 h-full w-full"
        priority
        sizes="100vw"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to top, rgba(3,3,4,0.92) 0%, rgba(3,3,4,0.35) 42%, transparent 68%)" }}
      />

      <div className="relative z-10 flex w-full flex-col gap-8 px-gutter pb-16 sm:pb-20">
        <div className="flex flex-col gap-5">
          <span ref={kickerRef} className="font-mono text-caption uppercase tracking-[0.3em] text-muted">
            {bmwMeta.kicker}
          </span>
          <h1 ref={headlineRef} className="max-w-2xl text-display font-bold leading-[1.05] text-foreground">
            Feel the machine
            <br />
            before the engine starts.
          </h1>
          <p ref={standfirstRef} className="max-w-md text-lead text-silver">
            {bmwMeta.standfirst}
          </p>
        </div>

        <div ref={metaRef} className="flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-6">
          {METADATA.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="font-mono text-caption uppercase tracking-widest text-muted">{item.label}</span>
              <span className="text-small text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={cueRef}
        aria-hidden
        className="absolute bottom-6 right-gutter z-10 flex flex-col items-center gap-3 text-caption uppercase tracking-widest text-muted"
      >
        <span>Scroll</span>
        <span className="block h-10 w-px bg-white/20" />
      </div>
    </section>
  );
}
