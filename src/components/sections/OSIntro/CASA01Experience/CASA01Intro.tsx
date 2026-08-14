"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";

import { casaSections } from "./casaContent";

interface CASA01IntroProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  /** Shared with CASA01Nav so it can flip its own colors the instant this
   * section reaches the top of the scroller - see CASA01Nav for why. */
  sectionRef: RefObject<HTMLElement | null>;
}

const content = casaSections.intro;

/**
 * Chapter 01 - the first ivory surface, arriving as the pinned hero
 * releases. Rounded top edge and a held shadow read as the surface rising
 * over the cinematic frame rather than a hard section cut. One statement,
 * one small technical annotation, no cards, no grid.
 */
export function CASA01Intro({ scrollerRef, prefersReducedMotion, sectionRef }: CASA01IntroProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const targets = [labelRef.current, headingRef.current, metaRef.current];
      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 26 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: "sine.out",
        scrollTrigger: { trigger: section, scroller, start: "top 80%", toggleActions: "play none none none" },
      });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef, sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-center gap-14 rounded-t-[2rem] bg-foreground px-gutter py-section text-background shadow-elevated sm:gap-20"
    >
      <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-background/50">
        {content.label}
      </span>

      <h2 ref={headingRef} className="max-w-3xl font-display text-h1 font-bold leading-[1.08] text-background">
        {content.heading[0]}
        <br />
        {content.heading[1]}
      </h2>

      <div
        ref={metaRef}
        className="flex flex-wrap gap-x-10 gap-y-2 font-mono text-caption uppercase tracking-[0.2em] text-background/60"
      >
        {content.metaLine.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
