"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface SettingsAppProps {
  reduceMotion: boolean;
  onReduceMotionChange: (value: boolean) => void;
}

/** Only controls that actually do something - one real toggle, scoped to
 * the desktop's own ambient motion (wallpaper drift, dock hover, window
 * transitions), plus an honest readout of the system-level preference it
 * layers on top of. No invented battery/network/storage widgets. */
export function SettingsApp({ reduceMotion, onReduceMotionChange }: SettingsAppProps) {
  const systemPrefersReduced = usePrefersReducedMotion();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-small font-bold text-foreground">Reduce Motion</span>
          <span className="text-caption text-muted">Calms the desktop&rsquo;s ambient animation.</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={reduceMotion}
          aria-label="Reduce desktop motion"
          onClick={() => onReduceMotionChange(!reduceMotion)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-[var(--duration-base)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            reduceMotion ? "border-accent/50 bg-accent/30" : "border-border bg-surface-raised"
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform duration-[var(--duration-base)] ease-out-expo",
              reduceMotion ? "translate-x-[1.375rem]" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      {systemPrefersReduced && (
        <p className="font-mono text-caption text-muted">
          Your system already requests reduced motion - the desktop honors that regardless of this setting.
        </p>
      )}
    </div>
  );
}
