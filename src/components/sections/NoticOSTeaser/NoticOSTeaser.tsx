"use client";

import { Archive, FlaskConical, Folder, UserRound } from "lucide-react";

import { GRAIN_SVG } from "@/components/layout/AtmosphereBackbone";
import { useOSLauncher } from "@/components/layout/OSLauncher/OSLauncherContext";
import { Scene } from "@/components/shared/Scene";
import { scrollTo } from "@/hooks/useLenis";

const SHORTCUTS = [
  { id: "projects", label: "Projects", icon: Folder, interactive: true },
  { id: "experiments", label: "Experiments", icon: FlaskConical, interactive: false },
  { id: "archive", label: "Archive", icon: Archive, interactive: false },
  { id: "profile", label: "Profile", icon: UserRound, interactive: false },
] as const;

/**
 * The earliest look at NOTIC OS - not the desktop itself, a restrained
 * system-window built from the same chrome the real OS windows use (glass,
 * grain, mono labels, the same four app icons). "Projects" is genuinely
 * live here (it opens the same window BMW/NOIR launch from); the other
 * three are honest previews of what's further in, not dead buttons. The
 * primary action scrolls to the full boot sequence - the OS proper - later
 * on the page.
 */
export function NoticOSTeaser() {
  const { openProjectsList } = useOSLauncher();

  return (
    <Scene id="os-teaser" tone="#08090c" fullHeight={false} className="py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex max-w-md flex-col gap-4">
          <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">
            Beyond the Homepage
          </span>
          <h2 className="font-display text-h1 font-bold leading-[1.1] text-foreground">
            The rest of NOTIC runs in its own OS.
          </h2>
          <p className="text-lead text-muted">
            A working desktop layer behind the site itself - projects, experiments and an archive, all
            live inside it.
          </p>
          <button
            type="button"
            onClick={() => scrollTo("#notic-os")}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-caption uppercase tracking-widest text-foreground transition-colors duration-[var(--duration-base)] ease-out-expo hover:border-accent/40 hover:text-accent-hover"
          >
            [ Enter Notic OS ]
          </button>
        </div>

        <div className="glass-strong relative w-full max-w-md overflow-hidden rounded-2xl shadow-elevated">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundRepeat: "repeat", opacity: 0.045, mixBlendMode: "overlay" }}
          />
          <div className="relative flex items-center justify-between border-b border-border px-5 py-3.5">
            <span className="font-mono text-caption uppercase tracking-widest text-muted">Notic OS</span>
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-caption uppercase tracking-widest text-muted">System Online</span>
            </div>
          </div>

          <div className="relative flex flex-col gap-1 p-5">
            {SHORTCUTS.map(({ id, label, icon: Icon, interactive }) =>
              interactive ? (
                <button
                  key={id}
                  type="button"
                  onClick={openProjectsList}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors duration-[var(--duration-base)] ease-out-expo hover:bg-surface-raised/60"
                >
                  <Icon className="h-4 w-4 text-accent-hover" strokeWidth={1.6} />
                  <span className="font-mono text-small text-foreground">{label}</span>
                  <span className="ml-auto font-mono text-caption uppercase tracking-widest text-muted opacity-0 transition-opacity duration-[var(--duration-base)] group-hover:opacity-100">
                    Open
                  </span>
                </button>
              ) : (
                <div key={id} className="flex items-center gap-3 px-2 py-2.5">
                  <Icon className="h-4 w-4 text-muted" strokeWidth={1.6} />
                  <span className="font-mono text-small text-muted">{label}</span>
                </div>
              )
            )}
          </div>

          <div className="relative flex items-center justify-between border-t border-border px-5 py-3.5">
            <span className="font-mono text-caption uppercase tracking-[0.2em] text-accent-hover">
              System Ready
            </span>
            <span aria-hidden className="font-mono text-caption text-muted">
              _
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
}
