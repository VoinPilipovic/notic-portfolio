"use client";

import { useEffect, useRef, useState } from "react";

import { HERO_SETTLE_SECONDS } from "@/animations/heroIntro.config";
import { gsap } from "@/animations/gsap";
import { MagneticLink } from "@/components/shared/MagneticLink";
import { scrollTo } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { LanguageToggle } from "./LanguageToggle";
import { MenuOverlay } from "./MenuOverlay";

// Hero's own opening sequence must play with zero UI on screen. The nav only
// reveals itself once that sequence has had room to land, reusing Hero's own
// timing constant read-only - Hero's timeline itself is never touched.
const HERO_INTRO_SECONDS = HERO_SETTLE_SECONDS;

const LINKS = [
  { label: "Work", target: "#work" },
  { label: "Capabilities", target: "#capabilities" },
  { label: "Lab", target: "#lab" },
  { label: "About", target: "#about" },
  { label: "Contact", target: "#contact" },
  // A doorway to NOTIC OS - jumps to the teaser, the earliest look at it,
  // rather than the full boot sequence further down. The dot is a quiet
  // "this one's different" cue, not a status indicator for anything real.
  { label: "OS", target: "#os-teaser", dot: true },
];

export function FloatingNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (prefersReducedMotion) {
      gsap.set(nav, { opacity: 1 });
      return;
    }

    const reveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      gsap.to(nav, { opacity: 1, duration: 0.8, ease: "sine.out" });
    };

    const onScroll = () => {
      if (window.scrollY > 40) reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(reveal, HERO_INTRO_SECONDS * 1000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  // The portfolio's own chrome has no business floating over NOTIC OS - it
  // dissolves away as that threshold is crossed, the last section on the
  // page, so this is a one-way fade with nothing to reveal it again.
  useEffect(() => {
    const nav = navRef.current;
    const osSection = document.getElementById("notic-os");
    if (!nav || !osSection || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.to(nav, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: osSection, start: "top 90%", end: "top 30%", scrub: true },
      });
    });

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <div
        ref={navRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-gutter py-6 opacity-0 sm:py-8"
      >
        {/* Scene content keeps scrolling freely beneath a fixed nav, so
            without this, body text can pass directly under - and collide
            with - the nav's own text at some scroll position. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40"
          style={{
            background: "linear-gradient(to bottom, rgba(10,10,13,0.85), transparent)",
          }}
        />
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="pointer-events-auto font-display text-h3 font-bold uppercase tracking-[0.12em] text-foreground transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover"
        >
          Notic
        </button>

        <nav className="pointer-events-auto hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <MagneticLink key={link.target} strength={0.35}>
              <button
                type="button"
                onClick={() => scrollTo(link.target)}
                className="inline-flex items-center gap-1.5 font-mono text-caption uppercase tracking-widest text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-foreground"
              >
                {link.label}
                {link.dot && <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />}
              </button>
            </MagneticLink>
          ))}
        </nav>

        <div className="pointer-events-auto flex items-center gap-6">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-caption uppercase tracking-widest text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-foreground"
          >
            Menu
          </button>
        </div>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
