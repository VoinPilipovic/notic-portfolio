"use client";

import { useEffect, useRef } from "react";

import { GRAIN_SVG } from "@/components/layout/AtmosphereBackbone";
import { gsap } from "@/animations/gsap";
import { socials } from "@/data/socials";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollTo } from "@/hooks/useLenis";

import { LanguageToggle } from "./LanguageToggle";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

const ENTRIES = [
  { index: "01", label: "Work", target: "#work" },
  { index: "02", label: "Capabilities", target: "#capabilities" },
  { index: "03", label: "Lab", target: "#lab" },
  { index: "04", label: "About", target: "#about" },
  { index: "05", label: "Contact", target: "#contact" },
  { index: "06", label: "OS", target: "#os-teaser", dot: true },
];

/**
 * Opening the menu is staged as three beats rather than one cross-dissolve:
 * the current scene physically recedes (the camera pulling back), the room
 * you've stepped into arrives (its own grain and light, not a flat panel),
 * then the index itself settles in, line by line. Closing reverses the same
 * beats, quieter and quicker, since leaving never needs the same ceremony
 * as arriving.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const firstEntry = overlayRef.current?.querySelector<HTMLButtonElement>("[data-menu-entry]");
    // Focus lands on the first entry once the overlay itself has started
    // arriving, not before - moving focus during the recede beat would
    // fight the animation for the user's attention.
    const focusTimer = window.setTimeout(() => firstEntry?.focus(), 550);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const mainEl = document.querySelector("main");
    const entries = overlay.querySelectorAll("[data-menu-entry]");

    // Hero pins itself (a fixed-position ScrollTrigger) for the first
    // viewport of scroll - and the nav can appear while still at scrollY 0,
    // before any scrolling happens, via its own timeout fallback. A
    // transform or filter on `main` (Hero's ancestor) creates a new
    // containing block for that fixed pin and would visibly break it, so
    // the recede beat only ever touches `main` once Hero's pin has
    // released. Hero itself is never read or modified - this only checks
    // where the page already is.
    const heroPinActive = window.scrollY < window.innerHeight * 1.4;
    const main = heroPinActive ? null : mainEl;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(overlay, { opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" });
        gsap.set(entries, { opacity: 1, y: 0, filter: "blur(0px)" });
        if (main) gsap.set(main, { scale: 1, filter: "blur(0px) brightness(1)" });
        return;
      }

      if (open) {
        gsap.set(overlay, { pointerEvents: "auto" });

        // Beat 1 - the scene you were in pulls back and dims, like a camera
        // easing away from a wall it was close against.
        if (main) {
          gsap.to(main, {
            scale: 0.965,
            filter: "blur(14px) brightness(0.82)",
            duration: 1.1,
            ease: "sine.inOut",
          });
        }

        // Beat 2 - the room you've stepped into arrives: its own vignette,
        // grain and light, not a flat panel dropped on top.
        gsap.fromTo(
          overlay,
          { opacity: 0, filter: "blur(10px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.9, delay: 0.05, ease: "sine.out" }
        );

        // Beat 3 - the index settles in, one line at a time, once the room
        // itself has had room to land.
        gsap.fromTo(
          entries,
          { opacity: 0, y: 16, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.09,
            delay: 0.5,
            ease: "sine.out",
          }
        );
      } else {
        // Leaving is quieter and quicker than arriving - the index steps
        // back first, the room dissolves, and the scene simply resumes.
        gsap.to(entries, {
          opacity: 0,
          y: 10,
          filter: "blur(6px)",
          duration: 0.4,
          stagger: 0.03,
          ease: "sine.in",
        });
        gsap.to(overlay, {
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.55,
          delay: 0.1,
          ease: "sine.in",
          onComplete: () => gsap.set(overlay, { pointerEvents: "none" }),
        });
        if (main) {
          gsap.to(main, {
            scale: 1,
            filter: "blur(0px) brightness(1)",
            duration: 0.9,
            delay: 0.1,
            ease: "sine.inOut",
          });
        }
      }
    }, overlay);

    return () => context.revert();
  }, [open, prefersReducedMotion]);

  const handleNavigate = (target: string) => {
    onClose();
    scrollTo(target);
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-10 opacity-0"
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 70% 60% at 50% 42%, var(--color-surface), var(--color-background) 72%)",
      }}
    >
      {/* The same film grain as the site-wide atmosphere layer, just deeper -
          the room you've stepped into shares the building's air, it isn't a
          separate, cleaner surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      />
      {/* A single soft, static source of light behind the index - the same
          "hidden skylight" language as the Hero, calmed to a held breath
          rather than a drift, since this is a pause, not a scene. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 36%, rgba(76,130,176,0.09), transparent 70%)",
          mixBlendMode: "soft-light",
        }}
      />

      <span
        data-menu-entry
        className="relative font-mono text-caption uppercase tracking-[0.3em] text-muted"
      >
        Creative Developer &amp; Digital Storyteller
      </span>

      <nav className="relative flex flex-col items-center gap-5">
        {ENTRIES.map((entry) => (
          <button
            key={entry.target}
            type="button"
            data-menu-entry
            onClick={() => handleNavigate(entry.target)}
            className="group flex items-baseline gap-4 font-sans text-h2 font-bold text-foreground transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover"
          >
            <span className="font-mono text-caption font-normal text-muted group-hover:text-accent-hover">
              {entry.index}
            </span>
            {entry.label}
            {entry.dot && <span aria-hidden className="mb-1 h-1.5 w-1.5 rounded-full bg-accent" />}
          </button>
        ))}
      </nav>

      <div className="relative flex items-center gap-6" data-menu-entry>
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith("http") ? "_blank" : undefined}
            rel={social.href.startsWith("http") ? "noreferrer" : undefined}
            className="font-mono text-caption uppercase tracking-widest text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-foreground"
          >
            {social.label}
          </a>
        ))}
      </div>

      <div className="relative" data-menu-entry>
        <LanguageToggle />
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        data-menu-entry
        className="absolute right-6 top-6 text-caption uppercase tracking-widest text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-foreground sm:right-10 sm:top-10"
      >
        Close
      </button>
    </div>
  );
}
