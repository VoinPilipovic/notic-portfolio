/**
 * Motion durations in seconds, for Framer Motion / GSAP.
 * Mirrors the ms values in src/styles/tokens.css so CSS transitions and
 * JS-driven animations stay in sync.
 */
export const DURATION = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
  cinematic: 1.6,
} as const;
