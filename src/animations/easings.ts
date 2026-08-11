/**
 * Cubic-bezier easing curves as arrays for Framer Motion / GSAP.
 * Mirrors the --ease-* tokens in src/styles/tokens.css.
 */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const satisfies Record<string, [number, number, number, number]>;
