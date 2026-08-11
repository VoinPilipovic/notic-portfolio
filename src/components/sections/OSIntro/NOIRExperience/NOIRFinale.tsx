"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { noirImages } from "./noirAssets";
import { noirChapters } from "./noirContent";
import { noirReveal } from "./noirMotion";

interface NOIRFinaleProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  onBack: () => void;
  onClose: () => void;
}

const content = noirChapters.finale;

/**
 * The close is quieter than the opening - the same smoke frame from the
 * Hero returns, but as a still, near-black closing image rather than a
 * moving backdrop, gradually consumed by darkness as the visitor scrolls
 * rather than arriving as a beat. NOIR doesn't end on a CTA card; it fades.
 */
export function NOIRFinale({ scrollerRef, prefersReducedMotion, onBack, onClose }: NOIRFinaleProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statementRef = useRef<HTMLSpanElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      noirReveal(
        section,
        [labelRef.current, headingRef.current, statementRef.current, creditRef.current, actionsRef.current],
        scroller,
        { stagger: 0.14, y: 18 }
      );

      const image = imageRef.current;
      if (!image || prefersReducedMotion) return;
      // The frame that opened the experience closes it too, but is left to
      // drain almost entirely to black - the last thing the visitor sees is
      // darkness settling, not a picture.
      gsap.fromTo(
        image,
        { opacity: 0.45 },
        {
          opacity: 0.04,
          ease: "none",
          scrollTrigger: { trigger: section, scroller, start: "top 40%", end: "bottom bottom", scrub: 0.8 },
        }
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black px-gutter py-section text-center"
    >
      <div ref={imageRef} className="absolute inset-0 opacity-45">
        <Image
          src={noirImages.heroSmoke}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/80" />

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-7">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="text-balance font-sans text-h2 font-bold uppercase tracking-[0.16em] text-foreground">
          {content.heading}
        </h2>
        <span ref={statementRef} className="text-balance text-lead text-silver">
          {content.statement}
        </span>

        <div ref={creditRef} className="mt-4 flex flex-col items-center gap-1.5">
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-muted">{content.credit}</span>
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-muted">{content.subcredit}</span>
        </div>

        <div ref={actionsRef} className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-caption uppercase tracking-widest text-foreground underline decoration-white/30 underline-offset-4 transition-[color,opacity,text-decoration-color] duration-[var(--duration-base)] ease-out-expo hover:text-silver hover:decoration-white/50 active:opacity-70"
          >
            ← Back to Projects
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-caption uppercase tracking-widest text-muted underline decoration-white/20 underline-offset-4 transition-[color,opacity,text-decoration-color] duration-[var(--duration-base)] ease-out-expo hover:text-foreground hover:decoration-white/40 active:opacity-70"
          >
            Return to NOTIC OS
          </button>
        </div>
      </div>
    </section>
  );
}
