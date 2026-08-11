"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface GlassImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * The shared "looking through glass or water" image treatment: an SVG
 * feDisplacementMap filter that warps the image, ramped in on pointer
 * hover rather than a scale() zoom. On touch/no-hover devices there's no
 * pointer to react to, so the same warp instead plays once, softly, as the
 * image scrolls into view.
 */
export function GlassImage({ src, alt, className, sizes, priority }: GlassImageProps) {
  const filterId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const displace = displaceRef.current;
    const sheen = sheenRef.current;
    if (!container || !displace || prefersReducedMotion) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const context = gsap.context(() => {
      if (canHover) {
        const enter = () => {
          gsap.to(displace, { attr: { scale: 16 }, duration: 0.7, ease: "sine.out" });
          if (sheen) gsap.to(sheen, { opacity: 1, duration: 0.7, ease: "sine.out" });
        };
        const leave = () => {
          gsap.to(displace, { attr: { scale: 0 }, duration: 0.6, ease: "sine.inOut" });
          if (sheen) gsap.to(sheen, { opacity: 0, x: 0, y: 0, duration: 0.6, ease: "sine.inOut" });
        };
        // A faint highlight that leans very slightly toward the pointer, as
        // if a thin pane of glass sat between viewer and photograph and its
        // reflection shifted with viewing angle - never brightness, scale or
        // the image itself, just a few px of drift on an almost-invisible
        // sheen.
        const move = (event: PointerEvent) => {
          if (!sheen) return;
          const rect = container.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(sheen, { x: nx * 18, y: ny * 18, duration: 0.9, ease: "sine.out" });
        };
        container.addEventListener("pointerenter", enter);
        container.addEventListener("pointerleave", leave);
        container.addEventListener("pointermove", move);
        return () => {
          container.removeEventListener("pointerenter", enter);
          container.removeEventListener("pointerleave", leave);
          container.removeEventListener("pointermove", move);
        };
      }

      gsap.to(displace, {
        attr: { scale: 14 },
        duration: 1,
        ease: "sine.out",
        yoyo: true,
        repeat: 1,
        scrollTrigger: { trigger: container, start: "top 85%", once: true },
      });
    }, container);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={7} result="noise" />
          <feDisplacementMap
            ref={displaceRef}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className="object-cover"
        style={{ filter: `url(#${filterId})` }}
      />
      <div
        ref={sheenRef}
        aria-hidden
        className="pointer-events-none absolute -inset-[15%] opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 50% 45%, rgba(242,240,235,0.16), transparent 70%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
