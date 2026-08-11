"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";

import { BMWMedia as SceneMedia } from "../BMWExperience/BMWMedia";
import { noirImages, noirVideos } from "./noirAssets";
import { noirMeta } from "./noirContent";

interface NOIRHeroProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

/**
 * Chapter 00 - the frame is allowed to breathe before anything is written
 * over it. Where BMW's hero commits to its headline within a beat, NOIR
 * holds - the video plays alone for a moment, then the wordmark and
 * statement arrive quietly, anchored to the lower third rather than dead
 * center, so the bottle itself - the actual subject of the frame - is
 * never sitting behind the type.
 */
export function NOIRHero({ scrollerRef, prefersReducedMotion }: NOIRHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const sublineRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const targets = [kickerRef.current, sublineRef.current, headlineRef.current, metaRef.current];
      if (prefersReducedMotion) {
        gsap.set([...targets, cueRef.current], { opacity: 1, y: 0 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 16 });
      gsap.set(cueRef.current, { opacity: 0 });
      // The first visual beat plays alone, well over a second longer than
      // BMW's own hero delay, before any type lands.
      const tl = gsap.timeline({ delay: 1.35 });
      tl.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1.25,
        stagger: 0.18,
        ease: "sine.out",
      }).to(cueRef.current, { opacity: 1, duration: 0.9, ease: "sine.out" }, "-=0.6");

      // The cue is an invitation, not a fixture - it quietly steps aside the
      // moment the visitor actually starts scrolling.
      gsap.to(cueRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section, scroller: scrollerRef.current, start: "top top", end: "20% top", scrub: 0.6 },
      });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-end justify-center overflow-hidden bg-black">
      <SceneMedia
        video={noirVideos.hero}
        poster={noirImages.heroSmoke}
        alt="A black glass bottle of NOIR N°01, lit by a single vertical beam through drifting smoke."
        scrollerRef={scrollerRef}
        prefersReducedMotion={prefersReducedMotion}
        className="absolute inset-0 z-0 h-full w-full"
        priority
        sizes="100vw"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 22%, transparent 46%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-3.5 px-gutter pb-20 text-center sm:pb-24">
        <span ref={kickerRef} className="font-sans text-h3 font-bold uppercase tracking-[0.22em] text-foreground">
          {noirMeta.kicker}
        </span>
        <span ref={sublineRef} className="font-mono text-caption uppercase tracking-[0.42em] text-silver">
          {noirMeta.subline}
        </span>
        <h1 ref={headlineRef} className="max-w-sm text-balance text-h3 font-normal leading-[1.35] text-silver">
          {noirMeta.headline}
        </h1>

        <div ref={metaRef} className="mt-7 flex flex-col items-center gap-1.5">
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-muted">{noirMeta.metaLine}</span>
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-muted">{noirMeta.credit}</span>
        </div>

        <div
          ref={cueRef}
          aria-hidden
          className="mt-5 flex flex-col items-center gap-2 text-caption uppercase tracking-[0.2em] text-muted"
        >
          <span>Scroll</span>
          <span className="block h-8 w-px bg-white/20" />
        </div>
      </div>
    </section>
  );
}
