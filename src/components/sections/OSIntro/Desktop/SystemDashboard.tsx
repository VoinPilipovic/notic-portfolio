"use client";

import { ArrowUpRight } from "lucide-react";

import { useOSLauncher } from "@/components/layout/OSLauncher/OSLauncherContext";

import type { DesktopAppsController } from "./useDesktopApps";

interface SystemDashboardProps {
  controller: DesktopAppsController;
}

const MODULES = ["WebGL", "GSAP", "Three.js", "Python / AI"];

/**
 * A restrained content panel for the desktop's otherwise-empty center,
 * built from the same chrome every other OS surface uses (border, mono
 * labels, the accent-dot status indicator from StatusArea). It doesn't
 * introduce any new interaction model - "Open" reaches the same
 * `useOSLauncher().openProject` BMW/NOIR use everywhere else, and
 * Experiments/Archive call the exact same `controller.openApp` the dock
 * icons already call. Hidden below `lg` so it never competes with the icon
 * column or dock on smaller desktop-OS viewports.
 */
export function SystemDashboard({ controller }: SystemDashboardProps) {
  const { openProject } = useOSLauncher();

  return (
    <div className="glass absolute right-6 top-28 hidden w-72 flex-col gap-5 rounded-2xl p-5 sm:right-10 sm:top-32 lg:flex">
      <span className="font-mono text-caption uppercase tracking-[0.2em] text-muted">Notic System</span>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Featured Experience</span>
        <div className="flex items-center justify-between gap-3">
          <span className="text-small font-medium text-foreground">BMW Experience</span>
          <button
            type="button"
            onClick={() => openProject("bmw")}
            className="flex shrink-0 items-center gap-1 font-mono text-caption uppercase tracking-widest text-accent-hover transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-foreground"
          >
            Open
            <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Recent</span>
        <button
          type="button"
          onClick={() => openProject("noir")}
          className="text-left text-small text-foreground/85 transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover"
        >
          NOIR N&deg;01
        </button>
        <button
          type="button"
          onClick={() => controller.openApp("experiments")}
          className="text-left text-small text-foreground/85 transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover"
        >
          Experiments
        </button>
        <button
          type="button"
          onClick={() => controller.openApp("archive")}
          className="text-left text-small text-foreground/85 transition-colors duration-[var(--duration-base)] ease-out-expo hover:text-accent-hover"
        >
          Archive
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Status</span>
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-caption uppercase tracking-widest text-foreground">System Online</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Modules</span>
        <div className="flex flex-wrap gap-2">
          {MODULES.map((module) => (
            <span key={module} className="rounded-full border border-border px-2.5 py-1 font-mono text-caption text-muted">
              {module}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
