"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { Desktop } from "./Desktop/Desktop";
import { Dock } from "./Desktop/Dock";
import { StatusArea } from "./Desktop/StatusArea";
import { useDesktopApps } from "./Desktop/useDesktopApps";

const BOOT_LINES = [
  "NOTIC OS v1.0",
  "Initializing...",
  "Loading Workspace...",
  "Loading Creative Environment...",
  "Connecting AI Systems...",
  "Preparing Projects...",
  "Workspace Ready.",
];

/**
 * The threshold between the portfolio and NOTIC OS - the site's last scene
 * dissolves into true black, a terminal boot log prints itself line by
 * line, a cinematic title lands, then a bare, non-interactive desktop wakes
 * up behind it. The whole sequence is scroll-scrubbed and pinned (the same
 * mechanism Hero uses for its own opening) rather than timer-driven, so it
 * always stays in lockstep with the user's own scroll input. Nothing here
 * is interactive yet - this sprint builds the doorway, not the room behind
 * it.
 */
export function OSIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const bootWrapRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const wallpaperGlowRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const desktop = useDesktopApps();
  const effectiveReduceMotion = prefersReducedMotion || desktop.reduceMotion;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(veilRef.current, { opacity: 1 });
        gsap.set(bootWrapRef.current, { opacity: 0 });
        gsap.set(titleRef.current, { opacity: 1, filter: "blur(0px)", scale: 1 });
        gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        gsap.set([wallpaperGlowRef.current, topBarRef.current, dockRef.current, appsRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set(lines, { opacity: 0, y: 6 });
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, filter: "blur(20px)", scale: 1.05 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(wallpaperGlowRef.current, { opacity: 0 });
      gsap.set(topBarRef.current, { opacity: 0, y: -10 });
      gsap.set(dockRef.current, { opacity: 0, y: 16 });
      gsap.set(appsRef.current, { opacity: 0, y: 10 });

      // The portfolio sinking into darkness as the threshold is approached -
      // scoped to this section only, so nothing upstream needs to change.
      gsap.to(veilRef.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top 90%", end: "top 30%", scrub: true },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=240%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      let cursor = 0.4;

      // The boot log prints itself one line at a time.
      lines.forEach((line) => {
        tl.to(line, { opacity: 1, y: 0, duration: 0.16, ease: "power1.out" }, cursor);
        cursor += 0.22;
      });

      tl.to(cursorRef.current, { opacity: 1, duration: 0.1 }, cursor).to(
        cursorRef.current,
        { opacity: 0, duration: 0.18, repeat: 3, yoyo: true },
        cursor + 0.1
      );
      cursor += 0.9; // a held beat on the completed log, before it clears

      tl.to(bootWrapRef.current, { opacity: 0, filter: "blur(8px)", duration: 0.45, ease: "sine.in" }, cursor);
      cursor += 0.55;

      // The cinematic title lands.
      tl.to(titleRef.current, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.9, ease: "sine.out" }, cursor)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "sine.out" }, cursor + 0.25);
      cursor += 0.9 + 0.8; // reveal + a hold on the title

      tl.to(
        [titleRef.current, subtitleRef.current],
        { opacity: 0, y: -12, filter: "blur(10px)", duration: 0.55, ease: "sine.in" },
        cursor
      );
      cursor += 0.55;

      // Only now does the desktop itself wake up - visual only, at rest.
      tl.to(wallpaperGlowRef.current, { opacity: 1, duration: 1.1, ease: "sine.inOut" }, cursor)
        .to(topBarRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "sine.out" }, cursor + 0.15)
        .to(dockRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "sine.out" }, cursor + 0.3)
        .to(appsRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "sine.out" }, cursor + 0.45);
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  // The desktop's own ambient life, independent of the boot timeline above -
  // a slow, perpetual drift on the wallpaper glow. Runs regardless of the
  // glow's current opacity (harmless while still hidden pre-boot), so this
  // never needs to touch the boot sequence's own choreography.
  useEffect(() => {
    const glow = wallpaperGlowRef.current;
    if (!glow || effectiveReduceMotion) return;

    const context = gsap.context(() => {
      gsap.set(glow, { xPercent: 0, yPercent: 0 });
      gsap.to(glow, {
        xPercent: 4,
        yPercent: -3,
        duration: 46,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => context.revert();
  }, [effectiveReduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="notic-os"
      aria-label="NOTIC OS"
      className="relative isolate flex h-screen min-h-screen items-center justify-center overflow-hidden"
    >
      <div ref={veilRef} aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-black opacity-0" />

      {/* The desktop - visual only, non-interactive. */}
      <div ref={desktopRef} aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
        <div
          ref={wallpaperGlowRef}
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 62%, rgba(76,130,176,0.16), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(243,241,238,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,238,0.028) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div
          ref={topBarRef}
          className="absolute inset-x-0 top-0 flex h-14 items-center border-b border-border px-8"
        >
          <StatusArea />
        </div>
      </div>

      {/* The dock and desktop icons - kept outside the aria-hidden/
          pointer-events-none decorative layer above, since these are real
          and interactive. */}
      <div ref={dockRef} className="pointer-events-none absolute inset-x-0 bottom-8 z-[6] flex justify-center">
        <div className="pointer-events-auto">
          <Dock projectsOpen={desktop.projectsOpen} openOrder={desktop.openOrder} onOpen={desktop.openApp} />
        </div>
      </div>

      <div ref={appsRef} className="absolute inset-0 z-[6]">
        <Desktop controller={desktop} reduceMotion={effectiveReduceMotion} />
      </div>

      {/* The boot log - never interactive, even before it fades. Without
          `pointer-events-none` this panel keeps intercepting clicks in its
          (centered, fairly large) bounding box after GSAP fades it to
          opacity 0, since opacity alone doesn't stop hit-testing - it sits
          at z-10, above the real desktop's icons/dock/windows at z-[6]
          inside this same isolated section, so it silently swallows input
          meant for whatever's underneath for the rest of the session. */}
      <div ref={bootWrapRef} className="pointer-events-none relative z-10 flex w-full max-w-md flex-col gap-3 px-gutter">
        {BOOT_LINES.map((line, i) => (
          <div
            key={line}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="flex items-center gap-3 font-mono text-small opacity-0"
          >
            <span className="text-accent-hover">&gt;</span>
            <span
              className={
                i === 0
                  ? "font-bold uppercase tracking-widest text-foreground"
                  : i === BOOT_LINES.length - 1
                    ? "font-bold text-accent-hover"
                    : "text-muted"
              }
            >
              {line}
            </span>
          </div>
        ))}
        <span ref={cursorRef} aria-hidden className="ml-6 mt-1 inline-block h-4 w-[2px] bg-accent opacity-0" />
      </div>

      {/* The welcome title. */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-gutter text-center">
        <span
          ref={titleRef}
          className="font-sans text-h1 font-bold uppercase tracking-[0.1em] text-foreground opacity-0"
        >
          Welcome to Notic OS.
        </span>
        <span ref={subtitleRef} className="text-caption uppercase tracking-[0.3em] text-silver opacity-0">
          Enter the creative workspace.
        </span>
      </div>
    </section>
  );
}
