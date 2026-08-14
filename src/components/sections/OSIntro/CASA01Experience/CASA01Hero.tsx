"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap, ScrollTrigger } from "@/animations/gsap";

import { casaImages } from "./casaAssets";
import { casaMeta } from "./casaContent";

interface CASA01HeroProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

/**
 * Chapter 00 - where BMW/NOIR let their heroes scroll away the instant the
 * visitor moves, CASA 01 holds its frame: a short pinned dwell with a
 * restrained cinematic push (1.02x to 1.10x scale, a hair of horizontal
 * drift) instead of a hard scroll-past. The photograph stays the entire
 * point; the title and meta only fade, they never move far.
 */
export function CASA01Hero({ scrollerRef, prefersReducedMotion }: CASA01HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const entrance = [titleRef.current, metaRef.current];

      if (prefersReducedMotion) {
        gsap.set(entrance, { opacity: 1, y: 0 });
        gsap.set(imageRef.current, { scale: 1.02 });
        return;
      }

      gsap.set(entrance, { opacity: 0, y: 16 });
      gsap.set(cueRef.current, { opacity: 0 });
      gsap.set(imageRef.current, { scale: 1.02, xPercent: 0 });

      gsap
        .timeline({ delay: 0.2 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: "sine.out" })
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "sine.out" }, "-=0.65")
        .to(cueRef.current, { opacity: 1, duration: 0.7, ease: "sine.out" }, "-=0.5");

      // The pinned push - the whole beat lives in this one scrubbed
      // timeline, scoped to the experience's own scroller.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(imageRef.current, { scale: 1.1, xPercent: -2, ease: "none" }, 0)
        .to(cueRef.current, { opacity: 0, ease: "none" }, 0)
        .to(metaRef.current, { opacity: 0, y: -10, ease: "none" }, 0.05)
        .to(titleRef.current, { opacity: 0, y: -16, ease: "none" }, 0.22);

      // The FLIP that mounts this chapter is still resizing the panel to
      // its final fullscreen rect when this effect first runs, so the pin's
      // initial measurements can be taken against a not-yet-fullscreen
      // scroller - a one-shot refresh once that settles keeps the pinned
      // range accurate without a recurring loop.
      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 1000);
      return () => window.clearTimeout(refreshTimer);
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen min-h-screen w-full items-end overflow-hidden bg-[#050506]"
    >
      <div ref={imageRef} className="absolute inset-0 z-0 h-full w-full will-change-transform">
        <Image
          src={casaImages.hero}
          alt="CASA 01, a concept Mediterranean residence at dusk, its façade lit against a darkening horizon."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to top, rgba(5,5,6,0.78) 0%, rgba(5,5,6,0.22) 38%, transparent 62%)" }}
      />

      <div className="relative z-10 flex w-full flex-col gap-6 px-gutter pb-20 sm:pb-24">
        <h1 ref={titleRef} className="font-display text-display font-bold leading-none tracking-[0.01em] text-foreground">
          {casaMeta.title}
        </h1>
        <div
          ref={metaRef}
          className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-caption uppercase tracking-[0.3em] text-silver"
        >
          {casaMeta.metaLine.map((item, i) => (
            <span key={item} className="flex items-center gap-5">
              {item}
              {i < casaMeta.metaLine.length - 1 && (
                <span aria-hidden className="h-1 w-1 rounded-full bg-white/25" />
              )}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={cueRef}
        aria-hidden
        className="absolute bottom-6 right-gutter z-10 flex flex-col items-center gap-3 font-mono text-caption uppercase tracking-widest text-muted"
      >
        <span>Scroll</span>
        <span className="block h-10 w-px bg-white/20" />
      </div>
    </section>
  );
}
