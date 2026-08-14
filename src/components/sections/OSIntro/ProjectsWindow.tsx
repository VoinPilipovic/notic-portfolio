"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, X } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { GRAIN_SVG } from "@/components/layout/AtmosphereBackbone";
import { expandableProjectSlugs, osProjects } from "@/data/osProjects";
import type { ProjectFilterId } from "@/data/osProjects";
import { startScroll, stopScroll } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ViewLoadingFallback } from "@/components/shared/ViewLoadingFallback";
import { cn } from "@/lib/utils";

import { ProjectsList } from "./ProjectsList";

// Each fullscreen project is its own chunk, fetched only once its slug is
// actually opened - BMW/NOIR/NOTIC PAY together are a meaningful amount of
// code (NOTIC PAY alone is a full second app), and none of it belongs in
// the homepage's initial bundle just because ProjectsWindow is always
// mounted underneath OSIntro. The FLIP expand (0.85-1.1s) usually covers
// the fetch, but a loading state is still here for a slow connection.
const BMWExperience = dynamic(() => import("./BMWExperience/BMWExperience").then((m) => m.BMWExperience), {
  ssr: false,
  loading: () => <ViewLoadingFallback />,
});
const NOIRExperience = dynamic(() => import("./NOIRExperience/NOIRExperience").then((m) => m.NOIRExperience), {
  ssr: false,
  loading: () => <ViewLoadingFallback />,
});
const NoticPayExperience = dynamic(
  () => import("./NoticPayExperience/NoticPayExperience").then((m) => m.NoticPayExperience),
  { ssr: false, loading: () => <ViewLoadingFallback /> }
);
const CASA01Experience = dynamic(
  () => import("./CASA01Experience/CASA01Experience").then((m) => m.CASA01Experience),
  { ssr: false, loading: () => <ViewLoadingFallback /> }
);

interface ProjectsWindowProps {
  open: boolean;
  activeSlug: string | null;
  onOpenProject: (slug: string) => void;
  onBack: () => void;
  onClose: () => void;
  selectedSlug: string | null;
  onSelectProject: (slug: string | null) => void;
  activeFilter: ProjectFilterId;
  onFilterChange: (filter: ProjectFilterId) => void;
}

// The windowed panel's own resting size (matches the sm: Tailwind classes
// below) - kept as JS constants too, since the fullscreen-project FLIP
// needs to compute this rect without measuring a DOM node that's mid-swap.
const WINDOWED_WIDTH = 832; // 52rem
const WINDOWED_HEIGHT = 608; // 38rem
const WINDOWED_RADIUS = "16px";

function windowedRect() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 640) {
    const height = vh * 0.86;
    return { top: vh - height, left: 0, width: vw, height, borderRadius: `${WINDOWED_RADIUS} ${WINDOWED_RADIUS} 0 0` };
  }
  const width = Math.min(WINDOWED_WIDTH, vw);
  const height = Math.min(WINDOWED_HEIGHT, vh * 0.85);
  return { top: (vh - height) / 2, left: (vw - width) / 2, width, height, borderRadius: WINDOWED_RADIUS };
}

function isExpandableSlug(slug: string | null) {
  return slug !== null && expandableProjectSlugs.includes(slug);
}

/**
 * The application itself - a single floating window whose content
 * transforms in place between the project list and a project's overview,
 * rather than navigating to a new screen. Modeled on a Finder/Linear
 * window: glass, a quiet title bar, restrained open/close motion. The
 * desktop stays visible (and faintly alive) behind it the whole time.
 *
 * Opening a fullscreen project (BMW, NOIR) is its own bespoke beat on top
 * of that: the panel physically expands from the windowed rect to fill the
 * viewport (a real FLIP, not a swap) - that mechanic is shared, since it's
 * just "make this window fullscreen," not particular to either project.
 * What plays out *behind* the veil during that expand is project-specific:
 * BMW's is unchanged from its own sprint; NOIR's is its own slower,
 * quieter sequence, never copied from BMW's.
 */
export function ProjectsWindow({
  open,
  activeSlug,
  onOpenProject,
  onBack,
  onClose,
  selectedSlug,
  onSelectProject,
  activeFilter,
  onFilterChange,
}: ProjectsWindowProps) {
  const activeProject = activeSlug ? osProjects.find((p) => p.slug === activeSlug) : undefined;
  const showingBmw = activeSlug === "bmw";
  const showingNoir = activeSlug === "noir";
  const showingNoticPay = activeSlug === "notic-pay";
  const showingCasa01 = activeSlug === "casa-01";
  const showingExpandedProject = isExpandableSlug(activeSlug);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const titleFlashRef = useRef<HTMLSpanElement>(null);
  const prevSlugRef = useRef<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Escape steps back one level while viewing an overview, and fully closes
  // from the list - matching the back/close buttons' own behavior.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeSlug) onBack();
      else onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 400);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, activeSlug, onBack, onClose]);

  // The main page's own scroll (Lenis + native) is fully stopped while this
  // window is open, so wheel/touch input over the panel can never leak
  // through to the portfolio underneath.
  useEffect(() => {
    if (open) {
      stopScroll();
      document.body.style.overflow = "hidden";
    } else {
      startScroll();
      document.body.style.overflow = "";
    }
    return () => {
      startScroll();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" });
        gsap.set(panel, { opacity: open ? 1 : 0, scale: 1, y: 0 });
        return;
      }

      if (open) {
        gsap.set(backdrop, { pointerEvents: "auto" });
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.out" });
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.96, y: 16, filter: "blur(6px)" },
          { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }
        );
      } else {
        gsap.to(panel, { opacity: 0, scale: 0.97, y: 10, filter: "blur(4px)", duration: 0.35, ease: "sine.in" });
        gsap.to(backdrop, {
          opacity: 0,
          duration: 0.4,
          delay: 0.05,
          ease: "sine.in",
          onComplete: () => gsap.set(backdrop, { pointerEvents: "none" }),
        });
      }
    });

    return () => context.revert();
  }, [open, prefersReducedMotion]);

  // The view transition: entering a fullscreen project gets its own expand
  // + veil sequence (BMW's exact original beats, or NOIR's own slower one);
  // leaving shrinks the same panel back down; anything else (plain list
  // navigation) gets the ordinary crossfade this already had.
  useEffect(() => {
    const panel = panelRef.current;
    const body = bodyRef.current;
    const veil = veilRef.current;
    if (!panel || !body) return;

    const wasExpanded = isExpandableSlug(prevSlugRef.current);
    const isExpanded = isExpandableSlug(activeSlug);
    const enteringBmw = activeSlug === "bmw" && !wasExpanded;
    const enteringNoir = activeSlug === "noir" && !wasExpanded;
    const enteringCasa01 = activeSlug === "casa-01" && !wasExpanded;
    prevSlugRef.current = activeSlug;

    if (prefersReducedMotion) {
      gsap.set(body, { opacity: 1, y: 0 });
      if (veil) gsap.set(veil, { opacity: 0 });
      if (titleFlashRef.current) gsap.set(titleFlashRef.current, { opacity: 0 });
      if (isExpanded) {
        gsap.set(panel, { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 0, margin: 0 });
      } else if (wasExpanded) {
        gsap.set(panel, { clearProps: "position,top,left,width,height,borderRadius,margin" });
      }
      return;
    }

    if (isExpanded && !wasExpanded) {
      const rect = panel.getBoundingClientRect();
      gsap.set(panel, {
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: 0,
        borderRadius: WINDOWED_RADIUS,
      });
      if (veil) gsap.set(veil, { opacity: 0 });

      const tl = gsap.timeline();

      if (enteringBmw) {
        // BMW's own sequence, unchanged from its own sprint.
        if (titleFlashRef.current) gsap.set(titleFlashRef.current, { opacity: 0, filter: "blur(10px)" });
        tl.to(panel, {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.85,
          ease: "power3.inOut",
          onComplete: () => gsap.set(panel, { width: "100%", height: "100%" }),
        });
        if (veil) {
          tl.to(veil, { opacity: 1, duration: 0.3 }, "-=0.35")
            .to(titleFlashRef.current, { opacity: 1, filter: "blur(0px)", duration: 0.35 }, "-=0.05")
            .to(titleFlashRef.current, { opacity: 0, filter: "blur(6px)", duration: 0.4 }, "+=0.45")
            .to(veil, { opacity: 0, duration: 0.5 }, "-=0.25");
        }
      } else if (enteringNoir) {
        // NOIR's own sequence - slower, quieter, no blur-focus beat: the
        // interface holds a moment, darkness slowly consumes it, a tiny
        // wordmark appears and clears, then the first frame is let in.
        if (titleFlashRef.current) gsap.set(titleFlashRef.current, { opacity: 0 });
        tl.to(panel, {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: () => gsap.set(panel, { width: "100%", height: "100%" }),
        });
        if (veil) {
          tl.to(veil, { opacity: 1, duration: 0.8, ease: "sine.inOut" }, "+=0.2")
            .to(titleFlashRef.current, { opacity: 1, duration: 0.7, ease: "sine.out" }, "+=0.25")
            .to(titleFlashRef.current, { opacity: 0, duration: 0.6, ease: "sine.in" }, "+=0.55")
            .to(veil, { opacity: 0, duration: 0.9, ease: "sine.inOut" }, "+=0.15");
        }
      } else if (enteringCasa01) {
        // CASA 01's own sequence - quiet and architectural: a brief held
        // black beat before the hero photograph is let in, using the
        // shared default title-flash treatment rather than a bespoke one.
        if (titleFlashRef.current) gsap.set(titleFlashRef.current, { opacity: 0, y: 8 });
        tl.to(panel, {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.95,
          ease: "power2.inOut",
          onComplete: () => gsap.set(panel, { width: "100%", height: "100%" }),
        });
        if (veil) {
          tl.to(veil, { opacity: 1, duration: 0.4, ease: "sine.inOut" }, "-=0.4")
            .to(titleFlashRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "sine.out" }, "-=0.05")
            .to(titleFlashRef.current, { opacity: 0, duration: 0.35, ease: "sine.in" }, "+=0.4")
            .to(veil, { opacity: 0, duration: 0.55, ease: "sine.inOut" }, "-=0.25");
        }
      } else {
        // A future expandable project with no bespoke sequence yet - the
        // FLIP still works, just without a veil moment on top of it.
        tl.to(panel, {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete: () => gsap.set(panel, { width: "100%", height: "100%" }),
        });
      }
      return;
    }

    if (!isExpanded && wasExpanded) {
      const target = windowedRect();
      gsap.to(panel, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        borderRadius: 16,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => gsap.set(panel, { clearProps: "position,top,left,width,height,borderRadius,margin" }),
      });
    }

    gsap.fromTo(
      body,
      { opacity: 0, y: 10, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "sine.out" }
    );
  }, [activeSlug, prefersReducedMotion]);

  return (
    <div
      ref={backdropRef}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-end justify-center opacity-0 sm:items-center sm:p-8"
      style={{ pointerEvents: "none", background: "rgba(5,5,7,0.72)" }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Projects"
        aria-hidden={!open}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "glass-strong relative flex h-[86vh] w-full flex-col overflow-hidden rounded-t-2xl shadow-elevated focus:outline-none sm:h-[38rem] sm:w-[52rem] sm:rounded-2xl",
          // The 85vh cap only ever meant to bound the small windowed popup
          // (mirrors windowedRect()'s own vh*0.85 below) - left unconditional,
          // it also clamps the fullscreen expanded state a few percent short
          // of the real viewport, since GSAP's inline `height` can't override
          // a separate `max-height` rule.
          !showingExpandedProject && "sm:max-h-[85vh]"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundRepeat: "repeat", opacity: 0.045, mixBlendMode: "overlay" }}
        />

        <div
          className={cn(
            "relative z-10 flex shrink-0 items-center justify-between px-6 py-4 sm:px-8",
            showingExpandedProject ? "border-b-0" : "border-b border-border"
          )}
        >
          <div className="flex items-center gap-3">
            {activeProject && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to Projects"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:border-accent/40 hover:text-accent-hover"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            )}
            <span
              className={cn(
                "font-mono text-caption uppercase tracking-widest",
                showingExpandedProject ? "text-white/70" : "text-muted"
              )}
            >
              {activeProject ? `Projects / ${activeProject.name}` : "Projects"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Projects"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:border-accent/40 hover:text-accent-hover"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Lenis is stopped while this window is open (see the scroll-lock
            effect above) so the portfolio underneath can't move - but its
            wheel/touch listener still runs globally and calls
            preventDefault() on anything without this escape hatch, which
            silently ate wheel input meant for the window's own scrolling.
            data-lenis-prevent tells Lenis to skip its own handling here and
            let native scroll take over. */}
        <div
          ref={bodyRef}
          data-lenis-prevent
          className={cn(
            "relative z-10 flex-1",
            showingExpandedProject ? "overflow-hidden" : "thin-scrollbar overflow-y-auto overscroll-contain"
          )}
        >
          {showingBmw ? (
            <BMWExperience onBack={onBack} onClose={onClose} />
          ) : showingNoir ? (
            <NOIRExperience onBack={onBack} onClose={onClose} />
          ) : showingNoticPay ? (
            <NoticPayExperience onBack={onBack} onClose={onClose} />
          ) : showingCasa01 ? (
            <CASA01Experience onBack={onBack} onClose={onClose} />
          ) : (
            <ProjectsList
              onOpenProject={onOpenProject}
              selectedSlug={selectedSlug}
              onSelect={onSelectProject}
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
            />
          )}
        </div>

        <div ref={veilRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0">
          <div className="flex h-full w-full items-center justify-center px-10">
            <span
              ref={titleFlashRef}
              className={cn(
                "text-center opacity-0",
                showingNoir
                  ? "font-mono text-caption uppercase tracking-[0.6em] text-silver"
                  : "font-sans text-h1 font-bold uppercase tracking-[0.12em] text-foreground"
              )}
            >
              {activeProject?.name ?? "BMW Experience"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
