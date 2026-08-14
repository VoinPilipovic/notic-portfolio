"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";

interface CASA01NavProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  /** CASA01Intro's own section - the moment its top edge reaches the
   * scroller's top, the nav is sitting over ivory instead of the dark hero,
   * so its glass and text colors flip to stay legible. */
  boundaryRef: RefObject<HTMLElement | null>;
  onBack: () => void;
}

const DARK_GLASS = "rgba(8,9,10,0.4)";
const DARK_BORDER = "rgba(255,255,255,0.08)";
const DARK_TEXT = "#f8f5f2";
const LIGHT_GLASS = "rgba(248,245,242,0.7)";
const LIGHT_BORDER = "rgba(10,11,13,0.1)";
const LIGHT_TEXT = "#0a0b0d";

/**
 * CASA 01's own project navigation - transparent over the hero, gaining
 * only a hairline of glass once the visitor starts scrolling, and flipping
 * from dark-glass/ivory-text to ivory-glass/graphite-text as the ivory
 * intro section rises underneath it. A wordmark and a single real action
 * (back to the project index) - no fabricated site nav.
 *
 * `contentRef`'s color is left to inherit down to its children (no
 * Tailwind text-color utility on the wordmark/link) so the GSAP color
 * tween below actually reaches them.
 */
export function CASA01Nav({ scrollerRef, boundaryRef, onBack }: CASA01NavProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const sentinel = sentinelRef.current;
    const glass = glassRef.current;
    const content = contentRef.current;
    const boundary = boundaryRef.current;
    if (!sentinel || !glass || !content) return;

    const context = gsap.context(() => {
      gsap.set(glass, { opacity: 0, backgroundColor: DARK_GLASS, borderColor: DARK_BORDER });
      gsap.set(content, { color: DARK_TEXT });

      // Transparent at the very top of the hero, a hairline of glass once
      // the visitor leaves that opening frame.
      gsap.to(glass, {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: sentinel, scroller, start: "top top", end: "+=140", scrub: 0.3 },
      });

      // Dark-over-hero to ivory-over-intro, scrubbed across the small
      // window where the intro section's edge actually crosses the nav.
      if (boundary) {
        gsap.timeline({
          scrollTrigger: { trigger: boundary, scroller, start: "top 80", end: "top -20", scrub: 0.4 },
        })
          .to(glass, { backgroundColor: LIGHT_GLASS, borderColor: LIGHT_BORDER }, 0)
          .to(content, { color: LIGHT_TEXT }, 0);
      }
    });

    return () => context.revert();
  }, [scrollerRef, boundaryRef]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <div className="sticky top-0 z-30 h-0 overflow-visible">
        <div ref={glassRef} aria-hidden className="absolute inset-x-0 top-0 border-b opacity-0" />
        <div ref={contentRef} className="relative flex items-center justify-between px-gutter py-5">
          <span className="font-mono text-caption uppercase tracking-[0.25em] opacity-90">
            NOTIC <span className="opacity-40">/</span> CASA 01
          </span>
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-caption uppercase tracking-[0.25em] opacity-80 transition-opacity duration-[var(--duration-base)] ease-out-expo hover:opacity-100"
          >
            Index
          </button>
        </div>
      </div>
    </>
  );
}
