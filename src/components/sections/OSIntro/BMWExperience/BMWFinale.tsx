"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { bmwImages } from "./bmwAssets";
import { bmwChapters, bmwMeta } from "./bmwContent";
import { chapterReveal } from "./motionHelpers";

interface BMWFinaleProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  onBack: () => void;
  onClose: () => void;
}

const content = bmwChapters.finale;

/**
 * Chapter 09 - the keynote-style close. The launch-stage photograph returns,
 * but as a backdrop the copy sits in front of rather than a frame the copy
 * sits beside (Chapter 02's role) - the same asset used for a clearly
 * different purpose, per the brief's own allowance. Ends with two real,
 * working exits rather than a fake external link.
 */
export function BMWFinale({ scrollerRef, prefersReducedMotion, onBack, onClose }: BMWFinaleProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const creditRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    chapterReveal(
      section,
      [eyebrowRef.current, headingRef.current, titleRef.current, creditRef.current, actionsRef.current, disclaimerRef.current],
      scrollerRef.current,
      { stagger: 0.08 }
    );
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black px-gutter py-24 text-center"
    >
      <Image
        src={bmwImages.launchStage}
        alt="A BMW on a launch stage, lit as the closing frame of the experience."
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0.92) 85%)" }}
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6">
        <span ref={eyebrowRef} className="font-mono text-caption uppercase tracking-[0.3em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="text-h1 font-bold leading-[1.1] text-foreground">
          {content.heading}
        </h2>
        <span ref={titleRef} className="font-mono text-caption uppercase tracking-[0.3em] text-silver">
          {bmwMeta.kicker}
        </span>
        <span ref={creditRef} className="text-small text-muted">
          {content.credit}
        </span>

        <div ref={actionsRef} className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-caption uppercase tracking-widest text-foreground underline decoration-white/30 underline-offset-4 transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover hover:decoration-accent-hover"
          >
            Return to NOTIC OS
          </button>
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-caption uppercase tracking-widest text-muted underline decoration-white/20 underline-offset-4 transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-foreground hover:decoration-white/40"
          >
            Back to Projects
          </button>
        </div>

        <p ref={disclaimerRef} className="mt-2 max-w-sm text-caption text-muted/70">
          {bmwMeta.disclaimer}
        </p>
      </div>
    </section>
  );
}
