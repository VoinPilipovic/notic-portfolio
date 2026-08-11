"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { BACKBONE_TONE_ID } from "@/components/layout/AtmosphereBackbone";
import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface SceneProps {
  id?: string;
  /** Background color this scene tones the site-wide backbone toward as it
   * scrolls into view - drawn from the existing neutral palette, never a new
   * hue. Omit to leave the backbone at whatever the previous scene set. */
  tone?: string;
  className?: string;
  /** Whether the scene fills a full viewport height. Defaults to true (every
   * existing scene's behavior). Compact sections (a short statement, a
   * metadata row) pass `false` so the section sizes to its own content
   * instead of centering inside an empty full screen - part of the density
   * pass: richer, shorter sections rather than uniform full-height ones. */
  fullHeight?: boolean;
  children: ReactNode;
}

/**
 * The shared scene primitive every section after Hero is built on: a full
 * `min-h-screen` section that (a) reveals its content with a single
 * restrained blur+fade+y as it enters the viewport, played once, and (b)
 * tweens the site-wide AtmosphereBackbone's color toward its own `tone`
 * across the boundary as the user scrolls in - the "every scroll reveals
 * another atmosphere" mechanic. Not pinned, not scrubbed internally - the
 * page always scrolls at the user's own pace; only the boundary crossfade
 * uses scrub.
 */
export function Scene({ id, tone, className, fullHeight = true, children }: SceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(content, { opacity: 1, y: 0, filter: "blur(0px)" });
        if (tone) {
          const backbone = document.getElementById(BACKBONE_TONE_ID);
          if (backbone) gsap.set(backbone, { backgroundColor: tone });
        }
        return;
      }

      gsap.fromTo(
        content,
        { opacity: 0, y: 22, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.3,
          ease: "sine.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      if (tone) {
        const backbone = document.getElementById(BACKBONE_TONE_ID);
        if (backbone) {
          gsap.to(backbone, {
            backgroundColor: tone,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              end: "top 22%",
              scrub: true,
            },
          });
        }
      }
    }, section);

    return () => context.revert();
  }, [tone, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative flex w-full items-center px-gutter py-section", fullHeight && "min-h-screen", className)}
    >
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </section>
  );
}
