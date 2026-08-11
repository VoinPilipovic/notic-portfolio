import { GRAIN_SVG } from "@/components/layout/AtmosphereBackbone";

/** One consistent corner calibration mark, mirrored via `className` - the
 * only literal "system" motif in the background, and static, so it reads
 * as a fixed instrument reference rather than decoration. */
function CornerTick({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`absolute h-5 w-5 opacity-[0.16] ${className}`} viewBox="0 0 20 20" fill="none">
      <path d="M1 8V1H8" stroke="#66c7cc" strokeWidth="1" />
    </svg>
  );
}

/**
 * True near-black with almost nothing added on top of it - a barely-there
 * radial falloff around where NOTIC constructs, a technical grid at the
 * edge of visibility, the site's own film grain (reused, not reinvented),
 * and two static corner ticks. No fog, no gradient blob, nothing that
 * moves on its own.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 58% 50% at 50% 46%, rgba(18,20,21,0.6), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,242,238,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,238,0.014) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.022,
          mixBlendMode: "overlay",
        }}
      />
      <CornerTick className="left-6 top-6 sm:left-10 sm:top-10" />
      <CornerTick className="bottom-6 right-6 rotate-180 sm:bottom-10 sm:right-10" />
    </div>
  );
}
