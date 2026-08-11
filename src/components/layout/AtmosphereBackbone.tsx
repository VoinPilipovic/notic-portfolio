"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const BACKBONE_TONE_ID = "atmosphere-backbone-tone";

// Was read from Hero's own fog config; that config is now Hero-intro-only
// (see heroIntro.config.ts), so this site-wide layer keeps its own literal
// value instead of depending on it.
const GRAIN_OPACITY = 0.035;

// A single tiled feTurbulence pattern, generated once and reused as a CSS
// background-image - static grain, not re-seeded per frame, so it reads as
// film stock rather than broadcast noise. Exported so any other fixed
// overlay (e.g. the menu) can deepen the same grain instead of inventing a
// second texture - one film stock for the whole experience, not two.
export const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/>` +
      `</svg>`
  );

/**
 * The persistent, site-wide atmosphere layer that sits behind every scene
 * after Hero: a fixed tone layer individual `Scene` instances crossfade
 * toward their own color (see Scene.tsx), a fixed film-grain overlay, and
 * two large, extremely slow navy light fields that drift
 * independently of any user input. This is what keeps the background from
 * ever reading as five flat black screens in a row - the room is always
 * gently lit, even at rest. `CursorLight` (mounted separately) layers the
 * interactive half of the same idea on top.
 */
export function AtmosphereBackbone() {
  const lightARef = useRef<HTMLDivElement>(null);
  const lightBRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const tone = document.getElementById(BACKBONE_TONE_ID);
    if (tone) tone.style.backgroundColor = "var(--color-background)";
  }, []);

  useEffect(() => {
    const a = lightARef.current;
    const b = lightBRef.current;
    if (!a || !b || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.set(a, { xPercent: -8, yPercent: -6 });
      gsap.to(a, { xPercent: 8, yPercent: 10, duration: 150, repeat: -1, yoyo: true, ease: "sine.inOut" });

      gsap.set(b, { xPercent: 10, yPercent: 8 });
      gsap.to(b, { xPercent: -10, yPercent: -6, duration: 190, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 12 });
    });

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <div
        id={BACKBONE_TONE_ID}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: "var(--color-background)" }}
      />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div
          ref={lightARef}
          className="absolute -inset-[25%]"
          style={{
            background:
              "radial-gradient(ellipse 45% 38% at 28% 32%, rgba(76,130,176,0.09), transparent 68%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          ref={lightBRef}
          className="absolute -inset-[25%]"
          style={{
            background:
              "radial-gradient(ellipse 40% 34% at 74% 68%, rgba(111,163,204,0.07), transparent 66%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[45]"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: GRAIN_OPACITY,
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
