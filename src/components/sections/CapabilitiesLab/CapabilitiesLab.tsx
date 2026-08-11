"use client";

import { useEffect, useRef, useState } from "react";
import { Boxes, Code2, Compass, Palette, Sparkles, Terminal } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { capabilities } from "@/data/capabilities";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const ICONS = [Palette, Code2, Boxes, Sparkles, Terminal, Compass];

/**
 * A hover/focus-driven demonstration rather than a static list or an
 * accordion - the central visual, its light and the tool set all respond
 * to whichever capability currently has attention, so the section proves
 * range instead of just naming it.
 */
export function CapabilitiesLab() {
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = ICONS[active];

  useEffect(() => {
    const panel = panelRef.current;
    const glow = glowRef.current;
    if (!panel) return;

    if (prefersReducedMotion) {
      gsap.set(panel, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(panel, { opacity: 0, y: 10, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "sine.out" });
    if (glow) {
      gsap.fromTo(glow, { opacity: 0.15, scale: 0.9 }, { opacity: 0.4, scale: 1, duration: 0.6, ease: "sine.out" });
    }
  }, [active, prefersReducedMotion]);

  return (
    <section id="capabilities" className="relative w-full px-gutter py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-4 pb-10">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">
            Capabilities Lab
          </span>
          <span className="hidden font-mono text-caption text-muted sm:inline">
            {String(capabilities.length).padStart(2, "0")} Modules
          </span>
        </div>
        <h2 className="max-w-xl font-display text-h1 font-bold text-foreground">How the work gets made.</h2>
      </div>

      <div className="mx-auto grid w-full max-w-content gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <ul className="flex flex-col border-t border-border">
          {capabilities.map((capability, i) => (
            <li key={capability.index}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn(
                  "group flex w-full items-baseline gap-5 border-b border-border py-5 text-left transition-colors duration-[var(--duration-base)] ease-out-expo",
                  active === i ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                <span className="font-mono text-caption text-muted">{capability.index}</span>
                <span className="text-h3 font-bold">{capability.title}</span>
                <span
                  className={cn(
                    "ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent transition-opacity duration-[var(--duration-base)]",
                    active === i ? "opacity-100" : "opacity-0"
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-8">
          <div
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute -inset-[20%]"
            style={{
              background: "radial-gradient(ellipse 50% 45% at 50% 30%, rgba(76,130,176,0.4), transparent 70%)",
              mixBlendMode: "screen",
            }}
          />

          <div ref={panelRef} className="relative flex flex-col gap-6">
            <Icon className="h-10 w-10 text-accent-hover" strokeWidth={1.4} />
            <div className="flex flex-col gap-2">
              <span className="font-mono text-caption uppercase tracking-widest text-muted">
                {capabilities[active].index} — {capabilities[active].title}
              </span>
              <p className="max-w-md text-lead text-foreground">{capabilities[active].description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities[active].tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border px-3 py-1 font-mono text-caption text-muted"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
