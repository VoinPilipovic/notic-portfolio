"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 15_000;

// Quantized to the tick interval, not raw Date.now() - useSyncExternalStore
// calls getSnapshot multiple times per render to detect tearing, and a
// millisecond-precision clock would never return the same value twice,
// which React would (rightly) treat as an unstable store.
function subscribe(callback: () => void) {
  const id = window.setInterval(callback, TICK_MS);
  return () => window.clearInterval(id);
}
function getSnapshot() {
  return Math.floor(Date.now() / TICK_MS);
}
function getServerSnapshot() {
  return 0;
}

/**
 * Real local time and date, not decoration. Server (and the client's first
 * hydration pass) render an empty clock; useSyncExternalStore's contract
 * swaps in the real tick immediately after, avoiding a text mismatch
 * without a setState-in-effect.
 */
export function StatusArea() {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = tick > 0 ? new Date() : null;

  const time = now ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";
  const date = now ? now.toLocaleDateString(undefined, { day: "2-digit", month: "short" }).toUpperCase() : "";

  return (
    <div className="flex w-full items-center justify-between">
      <span className="font-mono text-caption uppercase tracking-[0.2em] text-foreground">Notic OS</span>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="hidden font-mono text-caption uppercase tracking-widest text-muted sm:inline">
            System Online
          </span>
        </div>
        <span className="hidden font-mono text-caption text-muted sm:inline">{date}</span>
        <span className="font-mono text-caption text-foreground">{time}</span>
      </div>
    </div>
  );
}
