"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { BACKBONE_TONE_ID } from "@/components/layout/AtmosphereBackbone";
import { MagneticLink } from "@/components/shared/MagneticLink";
import { Button } from "@/components/ui/Button";
import { socials } from "@/data/socials";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TONE = "#0a0a0d";

/**
 * The closing scene - the brightest, cleanest light on the site (one
 * strong navy glow, not a chaotic finale) and the NOTIC mark returning at
 * scale, closing the loop the Hero opened.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        if (glow) gsap.set(glow, { opacity: 0.6 });
        return;
      }

      if (glow) {
        gsap.set(glow, { opacity: 0.15 });
        gsap.to(glow, {
          opacity: 0.6,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 70%", end: "top 20%", scrub: 0.6 },
        });
      }

      const backbone = document.getElementById(BACKBONE_TONE_ID);
      if (backbone) {
        gsap.to(backbone, {
          backgroundColor: TONE,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 78%", end: "top 22%", scrub: true },
        });
      }
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-gutter py-section text-center"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute -inset-[10%]"
        style={{
          background: "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(76,130,176,0.5), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8">
        <span className="font-mono text-caption uppercase tracking-[0.3em] text-accent-hover">
          Let&rsquo;s talk
        </span>
        <h2 className="font-display text-h1 font-bold leading-[1.05] text-foreground">
          Let&rsquo;s build something people remember.
        </h2>
        <p className="max-w-md text-lead text-muted">
          Have an idea, a project or a world that needs to exist? Tell me where we begin.
        </p>

        <MagneticLink>
          <Button variant="primary" onClick={() => (window.location.href = "mailto:hello@notic.dev")}>
            Start a Project
          </Button>
        </MagneticLink>

        <p className="font-mono text-caption text-muted">
          PS C:\NOTIC&gt; start-project<span className="text-accent-hover">_</span>
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {socials.map((social) => (
            <MagneticLink key={social.label}>
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="font-mono text-caption uppercase tracking-widest text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover"
              >
                {social.label}
              </a>
            </MagneticLink>
          ))}
        </div>

        <span className="mt-10 font-display text-h2 font-bold uppercase tracking-[0.14em] text-foreground">
          Notic
        </span>
        <p className="font-mono text-caption uppercase tracking-widest text-muted">
          &copy; {new Date().getFullYear()} Notic — Voin Pilipović
        </p>
      </div>
    </section>
  );
}
