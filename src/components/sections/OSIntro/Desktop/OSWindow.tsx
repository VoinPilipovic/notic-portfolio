"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { GRAIN_SVG } from "@/components/layout/AtmosphereBackbone";
import { useMounted } from "@/hooks/useMounted";

interface OSWindowProps {
  open: boolean;
  onClose: () => void;
  onFocus: () => void;
  title: string;
  icon: LucideIcon;
  zIndex: number;
  reduceMotion: boolean;
  cascadeIndex: number;
  children: ReactNode;
}

/**
 * The shared shell every OS app (besides Projects, which already has its
 * own more elaborate window) is built on: a small floating panel, draggable
 * by its title bar on desktop, that becomes a bottom sheet on mobile. No
 * backdrop - real desktop windows don't dim the rest of the screen, so the
 * other icons and windows stay reachable while this one is open. Stays
 * mounted at all times and toggles opacity/pointer-events, the same
 * pattern already proven in ProjectsWindow and MenuOverlay.
 */
export function OSWindow({
  open,
  onClose,
  onFocus,
  title,
  icon: Icon,
  zIndex,
  reduceMotion,
  cascadeIndex,
  children,
}: OSWindowProps) {
  const mounted = useMounted();
  // `positionRef` owns the cascade/drag transform; `animRef` (a nested
  // child) is the one GSAP tweens for the open/close arrival. Both would
  // otherwise fight over the same element's `transform`/`y` - GSAP writes
  // the whole property once it tweens any part of it, silently overwriting
  // the cascade offset on every tick.
  const positionRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  // Deliberately persists across close/reopen within the session - a real
  // desktop window stays where you left it rather than re-centering itself
  // every time.
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;

    if (reduceMotion) {
      gsap.set(anim, { opacity: open ? 1 : 0, scale: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    if (open) {
      gsap.fromTo(
        anim,
        { opacity: 0, scale: 0.96, y: 10, filter: "blur(6px)" },
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
      );
    } else {
      gsap.to(anim, { opacity: 0, scale: 0.97, y: 8, filter: "blur(4px)", duration: 0.25, ease: "sine.in" });
    }
  }, [open, reduceMotion]);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      const timer = window.setTimeout(() => positionRef.current?.focus(), 150);
      wasOpenRef.current = true;
      return () => window.clearTimeout(timer);
    }
    wasOpenRef.current = open;
  }, [open]);

  const handleTitlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Capturing the pointer here (below) retargets every subsequent pointer
    // event for this gesture - including the synthesized `click` - to this
    // title bar element instead of whatever was actually under the cursor.
    // Left unguarded, that silently swallows clicks on the close button (or
    // any other interactive element ever added to the title bar), since its
    // own onClick never fires once the bar has captured the pointer.
    if ((event.target as HTMLElement).closest("button")) return;
    if (!window.matchMedia("(min-width: 640px) and (pointer: fine)").matches) return;
    onFocus();
    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleTitlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setOffset({
      x: dragRef.current.originX + dx,
      y: Math.max(dragRef.current.originY + dy, -window.innerHeight / 2 + 80),
    });
  };
  const handleTitlePointerUp = () => {
    dragRef.current = null;
  };

  if (!mounted) return null;

  // Same-sized panels need real separation to read as a cascade rather
  // than a stack of illegible overlapping text. The vertical step alone is
  // wide enough to clear a full title bar, so every open window's label
  // and close button stay visible and clickable even several deep; the
  // small horizontal step is just enough to read as an offset, not a
  // meaningful reveal on its own.
  const cascadeX = cascadeIndex >= 0 ? cascadeIndex * 28 : 0;
  const cascadeY = cascadeIndex >= 0 ? cascadeIndex * 64 : 0;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 flex items-end justify-center sm:items-center sm:p-8"
      style={{ zIndex }}
    >
      <div
        ref={positionRef}
        role="dialog"
        aria-label={title}
        aria-hidden={!open}
        tabIndex={-1}
        onPointerDown={onFocus}
        className="pointer-events-auto relative w-full focus:outline-none sm:w-[26rem]"
        style={{
          pointerEvents: open ? "auto" : "none",
          transform: `translate(${offset.x + cascadeX}px, ${offset.y + cascadeY}px)`,
        }}
      >
        <div
          ref={animRef}
          className="glass-strong relative flex max-h-[80vh] w-full flex-col overflow-hidden rounded-t-2xl opacity-0 shadow-elevated sm:rounded-2xl"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundRepeat: "repeat", opacity: 0.045, mixBlendMode: "overlay" }}
          />

          <div
            onPointerDown={handleTitlePointerDown}
            onPointerMove={handleTitlePointerMove}
            onPointerUp={handleTitlePointerUp}
            className="relative flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5 sm:cursor-grab sm:active:cursor-grabbing"
          >
            <div className="flex items-center gap-2.5">
              <Icon className="h-3.5 w-3.5 text-accent-hover" strokeWidth={1.75} />
              <span className="font-mono text-caption uppercase tracking-widest text-muted">{title}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${title}`}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted transition-colors duration-[var(--duration-base)] ease-out-expo hover:border-accent/40 hover:text-accent-hover"
            >
              <X className="h-3 w-3" strokeWidth={1.75} />
            </button>
          </div>

          <div className="relative overflow-y-auto p-6" data-lenis-prevent>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
