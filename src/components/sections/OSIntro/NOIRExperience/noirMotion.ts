import { gsap } from "@/animations/gsap";

interface RevealOptions {
  stagger?: number;
  y?: number;
  start?: string;
  duration?: number;
}

/**
 * NOIR's own content reveal - a sibling of BMWExperience/motionHelpers.ts's
 * `chapterReveal`, deliberately not shared with it. BMW's timing stays
 * exactly as it was; NOIR earns its own, slower cadence here so the two
 * experiences keep reading as different temperaments, not the same engine
 * with different colors.
 */
export function noirReveal(
  section: Element,
  rawTargets: (Element | null | undefined)[],
  scroller: Element | null,
  { stagger = 0.16, y = 24, start = "top 76%", duration = 1.15 }: RevealOptions = {}
) {
  const targets = rawTargets.filter((t): t is Element => Boolean(t));
  if (targets.length === 0) return;
  gsap.set(targets, { opacity: 0, y, filter: "blur(14px)" });
  gsap.to(targets, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration,
    ease: "sine.out",
    stagger,
    scrollTrigger: { trigger: section, scroller, start, toggleActions: "play none none none" },
  });
}

/**
 * A black veil laid over a chapter's visual field (video, poster, macro
 * frame) that dissolves as the chapter arrives, so the next scene emerges
 * out of darkness instead of hard-cutting in the instant it crosses the
 * viewport edge. This is the "chapter transition" - there is no separate
 * wipe or curtain element between sections, just this held darkness
 * clearing slowly over each chapter's own frame.
 */
export function sceneVeilReveal(
  section: Element,
  veil: Element | null,
  scroller: Element | null,
  { start = "top 85%", end = "top 35%" }: { start?: string; end?: string } = {}
) {
  if (!veil) return;
  gsap.set(veil, { opacity: 1 });
  gsap.to(veil, {
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: section, scroller, start, end, scrub: 0.9 },
  });
}
