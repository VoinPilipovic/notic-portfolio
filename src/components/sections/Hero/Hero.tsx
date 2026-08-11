"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { gsap } from "@/animations/gsap";
import { heroIntroConfig } from "@/animations/heroIntro.config";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { HeroBackground } from "./atmosphere/HeroBackground";
import type { ParticleMaterial } from "./atmosphere/particleMaterial";

const NoticParticles = dynamic(() => import("./atmosphere/NoticParticles").then((m) => m.NoticParticles), {
  ssr: false,
});

/** The one accent for the whole Hero - local, never written into the
 * shared token file, the same discipline BMW's own local blue established
 * in BMWExperience/motionHelpers.ts. */
const SIGNAL_ACCENT = "#66c7cc";
const HERO_BG = "#060708";

const DISPLAY_FONT_VAR = "var(--font-syne)";
const MONO_FONT_VAR = "var(--font-ibm-plex-mono)";
const UI_FONT_VAR = "var(--font-instrument-sans)";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const particleWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const descriptorRef = useRef<HTMLSpanElement>(null);
  const microcopyRef = useRef<HTMLSpanElement>(null);
  const microCursorRef = useRef<HTMLSpanElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const [particleMaterial, setParticleMaterial] = useState<ParticleMaterial | null>(null);
  const [isNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleParticlesReady = useCallback((material: ParticleMaterial) => setParticleMaterial(material), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion never mounts the WebGL particle canvas at all (see
    // JSX below) - a fast, elegant static resolve straight to the sharp
    // wordmark, no particle travel.
    if (prefersReducedMotion) {
      const context = gsap.context(() => {
        gsap.set([wordmarkRef.current, descriptorRef.current, microcopyRef.current, scrollCueRef.current], {
          opacity: 0,
        });
        const tl = gsap.timeline({ defaults: { ease: "sine.out" } });
        tl.to(wordmarkRef.current, { opacity: 1, duration: 0.3 })
          .to(descriptorRef.current, { opacity: 1, duration: 0.25 }, "-=0.08")
          .to(microcopyRef.current, { opacity: 1, duration: 0.25 }, "-=0.12")
          .to(scrollCueRef.current, { opacity: 1, duration: 0.25 });
      }, section);

      return () => context.revert();
    }

    if (!particleMaterial) return;

    const context = gsap.context(() => {
      const t = heroIntroConfig.timing;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      gsap.set(particleWrapRef.current, { opacity: 1 });
      gsap.set(wordmarkRef.current, { opacity: 0, filter: "blur(6px)", scale: 1.015 });
      gsap.set([descriptorRef.current, microcopyRef.current], { opacity: 0, y: 8 });
      gsap.set(microCursorRef.current, { opacity: 0 });
      gsap.set(scrollCueRef.current, { opacity: 0 });
      particleMaterial.uniforms.uProgress.value = 0;
      particleMaterial.uniforms.uFlash.value = 0;

      let cursor = t.intro;

      // Scattered signal -> attraction -> construction. One GSAP tween
      // drives every particle's shared progress uniform; each particle's
      // own arrival is staggered inside the shader via its `aDelay`
      // attribute, so this single tween is what produces the whole
      // overlapping five-letter build.
      tl.to(particleMaterial.uniforms.uProgress, { value: 1, duration: t.construction, ease: "power2.out" }, cursor);
      cursor += t.construction;

      // Precision -> lock: a brief hold, a controlled brightness build,
      // one clean flash, then the crossfade to the razor-sharp DOM
      // wordmark timed to land while the flash is brightest - the actual
      // swap is hidden inside that instant rather than read as a cut.
      const lockStart = cursor;
      tl.to(
        particleMaterial.uniforms.uFlash,
        { value: 1, duration: t.lock * 0.4, ease: "power1.in" },
        lockStart + t.lock * 0.12
      );
      tl.to(particleWrapRef.current, { opacity: 0, duration: t.lock * 0.28 }, lockStart + t.lock * 0.5);
      tl.to(
        wordmarkRef.current,
        { opacity: 1, filter: "blur(0px)", scale: 1, duration: t.lock * 0.32, ease: "sine.out" },
        lockStart + t.lock * 0.5
      );
      tl.to(
        particleMaterial.uniforms.uFlash,
        { value: 0, duration: t.lock * 0.35, ease: "sine.out" },
        lockStart + t.lock * 0.62
      );
      cursor += t.lock + t.hold;

      tl.to(descriptorRef.current, { opacity: 1, y: 0, duration: t.descriptor, ease: "sine.out" }, cursor);
      tl.to(
        microcopyRef.current,
        { opacity: 1, y: 0, duration: t.reveal * 0.6, ease: "sine.out" },
        cursor + t.descriptor * 0.5
      );
      cursor += t.descriptor;

      const cursorBlinkAt = cursor + 0.1;
      tl.fromTo(microCursorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.08 }, cursorBlinkAt)
        .to(microCursorRef.current, { opacity: 0.15, duration: 0.1, repeat: 3, yoyo: true }, cursorBlinkAt + 0.08)
        .to(microCursorRef.current, { opacity: 1, duration: 0.15 }, cursorBlinkAt + 0.08 + 4 * 0.1);

      tl.to(scrollCueRef.current, { opacity: 1, duration: t.reveal }, cursor);
      cursor += t.reveal;

      gsap.to(scrollDotRef.current, {
        yPercent: 100,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: cursor,
      });

      // The exit - NOTIC, the descriptor and the microcopy fade and lift
      // away as the visitor scrolls, a solid surface tone rises to hand
      // off cleanly into the next section.
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=80%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
        .to(scrollCueRef.current, { opacity: 0, duration: 0.1 }, 0)
        .to(
          [wordmarkRef.current, descriptorRef.current, microcopyRef.current],
          { opacity: 0, y: -20, filter: "blur(8px)", duration: 0.5 },
          0.05
        )
        .to(surfaceRef.current, { opacity: 1, duration: 0.5 }, 0.35);
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, particleMaterial]);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative isolate flex h-screen min-h-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: HERO_BG }}
    >
      <HeroBackground />

      {!prefersReducedMotion && (
        <div ref={particleWrapRef} className="pointer-events-none absolute inset-0 z-[5] opacity-0">
          <NoticParticles
            onReady={handleParticlesReady}
            particleCount={isNarrow ? heroIntroConfig.particles.mobileCount : heroIntroConfig.particles.desktopCount}
            colorBase="#f2f2ee"
            colorSignal={SIGNAL_ACCENT}
            fontFamilyVar={DISPLAY_FONT_VAR}
          />
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 px-gutter text-center"
      >
        <span
          ref={wordmarkRef}
          className="text-display font-bold uppercase leading-none tracking-[0.22em] text-foreground opacity-0"
          style={{ fontFamily: DISPLAY_FONT_VAR }}
        >
          NOTIC
        </span>

        <span
          ref={descriptorRef}
          className="text-caption uppercase tracking-[0.28em] text-silver opacity-0"
          style={{ fontFamily: UI_FONT_VAR }}
        >
          Creative Developer / Interactive Experiences
        </span>

        <span
          ref={microcopyRef}
          className="text-[0.68rem] tracking-[0.06em] text-muted opacity-0"
          style={{ fontFamily: MONO_FONT_VAR }}
        >
          PS C:\NOTIC&gt; system.ready
          <span ref={microCursorRef} style={{ color: SIGNAL_ACCENT }}>
            _
          </span>
        </span>
      </div>

      <div
        ref={scrollCueRef}
        aria-hidden
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-caption uppercase tracking-widest text-muted opacity-0"
        style={{ fontFamily: UI_FONT_VAR }}
      >
        <span>Scroll to Explore</span>
        <span className="relative block h-12 w-px overflow-hidden bg-border">
          <span
            ref={scrollDotRef}
            className="absolute inset-x-0 top-0 h-1/2 w-px"
            style={{ backgroundColor: SIGNAL_ACCENT }}
          />
        </span>
      </div>

      <div ref={surfaceRef} aria-hidden className="pointer-events-none absolute inset-0 z-40 bg-surface opacity-0" />
    </section>
  );
}
