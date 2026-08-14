"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import { gsap } from "@/animations/gsap";
import { GRAIN_SVG } from "@/components/layout/AtmosphereBackbone";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { PaymentCardData } from "@/types/banking";
import { cn } from "@/lib/utils";

import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

interface PaymentCardProps {
  card: PaymentCardData;
  frozen?: boolean;
  className?: string;
}

const X_LIMIT = 18;
const DRAG_THRESHOLD = 4;
const DEG_PER_PX_Y = 0.5;
const DEG_PER_PX_X = 0.25;

/** Reads the current rotation and drives the sheen/edge-light so the
 * card's material responds to whatever angle it's actually at right now -
 * called on every drag/inertia tick, not just on release. */
function applyLighting(el: HTMLDivElement, sheenEl: HTMLDivElement | null, edgeEl: HTMLDivElement | null) {
  const rotY = (gsap.getProperty(el, "rotationY") as number) || 0;
  const norm = ((rotY % 360) + 360) % 360; // 0-360
  const signed = norm > 180 ? norm - 360 : norm; // -180..180

  if (sheenEl) {
    gsap.set(sheenEl, { xPercent: gsap.utils.clamp(-60, 160, 50 + signed * 0.65) });
  }
  if (edgeEl) {
    // Peaks at the edge-on angles (±90°) where a real edge would catch light.
    const distanceFrom90 = Math.min(Math.abs(Math.abs(signed) - 90), 90);
    const intensity = Math.max(0, 1 - distanceFrom90 / 35);
    gsap.set(edgeEl, { opacity: intensity * 0.55 });
  }
}

function isBackFacing(el: HTMLDivElement) {
  const rotY = (gsap.getProperty(el, "rotationY") as number) || 0;
  const norm = ((rotY % 360) + 360) % 360;
  return norm > 90 && norm < 270;
}

/**
 * The card: dark premium material that genuinely rotates - click/touch-drag
 * on desktop and mobile, full front-to-back inspection, inertia settling on
 * release. CSS 3D transforms + GSAP's InertiaPlugin, no WebGL - there's
 * nothing here a canvas would render better.
 */
export function PaymentCard({ card, frozen, className }: PaymentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const [isBack, setIsBack] = useState(false);
  const isBackRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Only schedules a re-render when the front/back face actually flips -
  // this runs on every pointermove/inertia tick, so without the guard it'd
  // call setState (and force a render pass) on every single frame of a
  // drag even though the boolean is unchanged almost all the time.
  const syncIsBack = (el: HTMLDivElement) => {
    const next = isBackFacing(el);
    if (next !== isBackRef.current) {
      isBackRef.current = next;
      setIsBack(next);
    }
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion) return;

    const drag = {
      active: false,
      committed: false,
      startX: 0,
      startY: 0,
      startRotY: 0,
      startRotX: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      vX: 0,
      vY: 0,
    };

    const onMove = (event: PointerEvent) => {
      if (!drag.active) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (!drag.committed) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.3) {
          // Predominantly vertical - this is a page scroll, not a card
          // drag. Bail out and let native scrolling own the gesture.
          drag.active = false;
          return;
        }
        drag.committed = true;
        setHasInteracted(true);
      }

      const rotY = drag.startRotY + dx * DEG_PER_PX_Y;
      const rotX = gsap.utils.clamp(-X_LIMIT, X_LIMIT, drag.startRotX - dy * DEG_PER_PX_X);
      gsap.set(el, { rotationY: rotY, rotationX: rotX });
      applyLighting(el, sheenRef.current, edgeRef.current);
      syncIsBack(el);

      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.vX = ((event.clientX - drag.lastX) / dt) * 1000;
      drag.vY = ((event.clientY - drag.lastY) / dt) * 1000;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = now;
    };

    const onUp = (event: PointerEvent) => {
      if (!drag.active) return;
      drag.active = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!drag.committed) return;
      if (el.hasPointerCapture?.(event.pointerId)) el.releasePointerCapture(event.pointerId);

      // Clamped so an enthusiastic flick still settles quickly and cleanly
      // rather than spinning through several full rotations.
      const velRotY = gsap.utils.clamp(-720, 720, drag.vX * DEG_PER_PX_Y);
      const velRotX = gsap.utils.clamp(-720, 720, -drag.vY * DEG_PER_PX_X);

      gsap.to(el, {
        inertia: {
          resistance: 400,
          rotationY: { velocity: velRotY },
          rotationX: { velocity: velRotX, min: -X_LIMIT, max: X_LIMIT },
        },
        onUpdate: () => {
          applyLighting(el, sheenRef.current, edgeRef.current);
          syncIsBack(el);
        },
      });
    };

    const onDown = (event: PointerEvent) => {
      gsap.killTweensOf(el, "rotationX,rotationY");
      drag.active = true;
      drag.committed = false;
      drag.startX = event.clientX;
      drag.startY = event.clientY;
      drag.startRotY = (gsap.getProperty(el, "rotationY") as number) || 0;
      drag.startRotX = (gsap.getProperty(el, "rotationX") as number) || 0;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = performance.now();
      drag.vX = 0;
      drag.vY = 0;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };

    el.addEventListener("pointerdown", onDown);
    applyLighting(el, sheenRef.current, edgeRef.current);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [prefersReducedMotion]);

  // Reduced motion: dragging still works (direct 1:1, no inertia flourish),
  // handled by a much simpler listener set.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !prefersReducedMotion) return;

    let active = false;
    let startX = 0;
    let startRotY = 0;

    const onMove = (event: PointerEvent) => {
      if (!active) return;
      const dx = event.clientX - startX;
      const rotY = gsap.utils.clamp(-100, 100, startRotY + dx * DEG_PER_PX_Y);
      gsap.set(el, { rotationY: rotY });
      syncIsBack(el);
      setHasInteracted(true);
    };
    const onUp = () => {
      active = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    const onDown = (event: PointerEvent) => {
      active = true;
      startX = event.clientX;
      startRotY = (gsap.getProperty(el, "rotationY") as number) || 0;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, [prefersReducedMotion]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div style={{ perspective: "1600px" }} className="w-full">
        <div
          ref={cardRef}
          style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
          className="relative aspect-[1.6/1] w-full cursor-grab select-none active:cursor-grabbing"
          onDragStart={(event) => event.preventDefault()}
        >
          {/* Front face */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className={cn(
              "absolute inset-0 overflow-hidden rounded-xl border border-white/[0.06] shadow-card transition-[filter] duration-300",
              frozen && "saturate-[0.35] brightness-95"
            )}
          >
            <CardMaterial sheenRef={sheenRef} edgeRef={edgeRef} />
            <CardFront card={card} />
            {frozen && <FrostOverlay />}
          </div>

          {/* Back face */}
          <div
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className={cn(
              "absolute inset-0 overflow-hidden rounded-xl border border-white/[0.06] shadow-card transition-[filter] duration-300",
              frozen && "saturate-[0.35] brightness-95"
            )}
          >
            <CardMaterial sheenRef={null} edgeRef={null} />
            <CardBack card={card} />
            {frozen && <FrostOverlay />}
          </div>
        </div>
      </div>

      <span
        aria-hidden
        className={cn(
          "font-mono text-caption uppercase tracking-widest transition-opacity duration-500",
          isBack ? "text-accent-hover opacity-100" : hasInteracted ? "opacity-0" : "text-muted opacity-100"
        )}
      >
        {isBack ? "Back of card" : "Drag to rotate"}
      </span>
    </div>
  );
}

function CardMaterial({
  sheenRef,
  edgeRef,
}: {
  sheenRef: RefObject<HTMLDivElement | null> | null;
  edgeRef: RefObject<HTMLDivElement | null> | null;
}) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(155deg, #1b1e21 0%, #111315 55%, #08090b 100%)" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundRepeat: "repeat", opacity: 0.035, mixBlendMode: "overlay" }}
      />
      {sheenRef && (
        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute -inset-y-10 -left-1/2 w-1/2 opacity-40"
          style={{ background: "linear-gradient(100deg, transparent, rgba(245,243,239,0.10), transparent)" }}
        />
      )}
      {edgeRef && (
        <div
          ref={edgeRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-6 opacity-0"
          style={{ background: "linear-gradient(90deg, transparent, rgba(110,159,200,0.5))" }}
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(245,243,239,0.08), inset 0 0 0 1px rgba(245,243,239,0.03)" }}
      />
    </>
  );
}

function FrostOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-accent-dim/25 backdrop-blur-[1.5px]">
      <span className="rounded-full border border-white/15 bg-background/60 px-4 py-1.5 font-mono text-caption uppercase tracking-widest text-foreground">
        Frozen
      </span>
    </div>
  );
}
