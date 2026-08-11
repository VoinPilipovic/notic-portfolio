import { gsap } from "@/animations/gsap";

/** Restrained BMW blue - a local accent for this experience only, never
 * written into the shared token file, so the rest of NOTIC stays navy. */
export const BMW_BLUE = "#5b9bd9";

interface RevealOptions {
  stagger?: number;
  y?: number;
  start?: string;
}

/** The one reveal every chapter shares: a measured blur+fade+rise, played
 * once as the chapter enters the experience's own scroll container. Chapters
 * differ in what they layer on top of this, not in how content arrives.
 * Accepts raw (possibly-null) ref values directly - callers pass
 * `[fooRef.current, barRef.current]` with no filtering of their own. */
export function chapterReveal(
  section: Element,
  rawTargets: (Element | null | undefined)[],
  scroller: Element | null,
  { stagger = 0.12, y = 22, start = "top 78%" }: RevealOptions = {}
) {
  const targets = rawTargets.filter((t): t is Element => Boolean(t));
  if (targets.length === 0) return;
  gsap.set(targets, { opacity: 0, y, filter: "blur(10px)" });
  gsap.to(targets, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.9,
    ease: "sine.out",
    stagger,
    scrollTrigger: { trigger: section, scroller, start, toggleActions: "play none none none" },
  });
}
