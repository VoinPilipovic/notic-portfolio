"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { bmwImages } from "./bmwAssets";
import { bmwChapters } from "./bmwContent";
import { chapterReveal } from "./motionHelpers";

interface BMWMotionProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = bmwChapters.motion;
const ANNOTATIONS = ["Rhythm", "Reflection", "Space"];

/**
 * Chapter 04 - the tunnel returns as a still, editorial frame rather than
 * the Hero's moving footage, so this chapter reads as its own beat: the
 * image drifts horizontally and widens slightly as the section scrolls,
 * while the copy itself never moves - speed expressed through the
 * environment, not through the words.
 */
export function BMWMotion({ scrollerRef, prefersReducedMotion }: BMWMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const annotationRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      chapterReveal(section, [labelRef.current, headingRef.current, bodyRef.current], scroller, { stagger: 0.1 });

      const annotations = annotationRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (prefersReducedMotion) {
        gsap.set(annotations, { opacity: 1 });
        if (frame) gsap.set(frame, { clipPath: "inset(6% 6% 6% 6%)" });
        return;
      }

      gsap.set(annotations, { opacity: 0 });
      gsap.to(annotations, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "sine.out",
        scrollTrigger: { trigger: section, scroller, start: "top 60%", toggleActions: "play none none none" },
      });

      if (frame) {
        gsap.fromTo(
          frame,
          { clipPath: "inset(10% 10% 10% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: section, scroller, start: "top bottom", end: "top 20%", scrub: 0.7 },
          }
        );
      }
      if (image) {
        gsap.fromTo(
          image,
          { xPercent: -4 },
          {
            xPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: section, scroller, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      }
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen w-full flex-col justify-center gap-10 overflow-hidden bg-[#08090a] py-24">
      <div className="relative z-10 flex flex-col gap-4 px-gutter">
        <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.25em] text-muted">
          {content.label}
        </span>
        <h2 ref={headingRef} className="max-w-xl text-h1 font-bold leading-[1.1] text-foreground">
          {content.heading}
        </h2>
        <p ref={bodyRef} className="max-w-md text-body text-silver">
          {content.body}
        </p>
      </div>

      <div ref={frameRef} className="relative mx-gutter aspect-[16/8] overflow-hidden rounded-sm sm:aspect-[21/9]">
        <div ref={imageRef} className="absolute inset-[-4%]">
          <Image
            src={bmwImages.tunnel}
            alt="A wide editorial crop of a BMW moving through a tunnel, light stretched into horizontal streaks."
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(5,5,6,0.55) 0%, transparent 20%, transparent 80%, rgba(5,5,6,0.55) 100%)" }}
        />

        {ANNOTATIONS.map((text, i) => (
          <span
            key={text}
            ref={(el) => {
              annotationRefs.current[i] = el;
            }}
            className="absolute font-mono text-caption uppercase tracking-widest text-white/70"
            style={{
              top: i === 0 ? "10%" : i === 1 ? "46%" : "82%",
              left: i === 0 ? "6%" : undefined,
              right: i === 1 ? "6%" : i === 2 ? "8%" : undefined,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
