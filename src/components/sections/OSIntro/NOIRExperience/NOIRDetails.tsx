"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { noirImages } from "./noirAssets";
import { noirChapters } from "./noirContent";
import { noirReveal, sceneVeilReveal } from "./noirMotion";

interface NOIRDetailsProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = noirChapters.object;

/**
 * Chapter 05 - the bottle presented as an industrial-design object rather
 * than a campaign shot. On desktop, a barely-there highlight leans toward
 * the pointer - a few pixels, never a tilt or a glow - and does nothing at
 * all on touch or under reduced motion.
 */
export function NOIRDetails({ scrollerRef, prefersReducedMotion }: NOIRDetailsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameVeilRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const fragmentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      noirReveal(section, [labelRef.current, frameRef.current], scroller, { stagger: 0.18, y: 28 });
      sceneVeilReveal(section, frameVeilRef.current, scroller, { start: "top 80%", end: "top 38%" });
      noirReveal(section, fragmentRefs.current, scroller, { start: "top 55%", stagger: 0.08 });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  useEffect(() => {
    const frame = frameRef.current;
    const highlight = highlightRef.current;
    if (!frame || !highlight || prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const quickX = gsap.quickTo(highlight, "xPercent", { duration: 0.9, ease: "sine.out" });
    const quickY = gsap.quickTo(highlight, "yPercent", { duration: 0.9, ease: "sine.out" });

    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      quickX(nx * 12);
      quickY(ny * 12);
    };
    const onEnter = () => gsap.to(highlight, { opacity: 1, duration: 0.5, ease: "sine.out" });
    const onLeave = () => gsap.to(highlight, { opacity: 0, duration: 0.6, ease: "sine.inOut" });

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-14 overflow-hidden bg-black px-gutter py-section"
    >
      <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-muted">
        {content.label}
      </span>

      <div ref={frameRef} className="relative aspect-[3/4] w-full max-w-sm overflow-hidden sm:max-w-md">
        <Image
          src={noirImages.productLight}
          alt="The NOIR N°01 bottle alone against total darkness, lit from above."
          fill
          sizes="(min-width: 640px) 28rem, 90vw"
          className="object-cover"
        />
        {!prefersReducedMotion && (
          <div ref={frameVeilRef} aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-black" />
        )}
        <div
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] opacity-0"
          style={{
            background: "radial-gradient(ellipse 40% 35% at 50% 50%, rgba(255,255,255,0.1), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-mono text-caption uppercase tracking-[0.32em] text-muted">{content.heading}</span>
        <p className="mt-2 text-h3 font-bold leading-[1.3] text-foreground">
          {content.fragments.map((fragment, i) => (
            <span
              key={fragment}
              ref={(el) => {
                fragmentRefs.current[i] = el;
              }}
              className="block"
            >
              {fragment}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
