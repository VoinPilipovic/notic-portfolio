"use client";

import { GlassImage } from "@/components/shared/GlassImage";
import { useOSLauncher } from "@/components/layout/OSLauncher/OSLauncherContext";
import { Button } from "@/components/ui/Button";
import type { OSProject } from "@/data/osProjects";
import { cn } from "@/lib/utils";

interface WorkCardProps {
  project: OSProject;
  /** Real preview photography for this project - omitted for in-development
   * entries, which show an honest status panel instead of a borrowed or
   * invented image. */
  image?: string;
  reversed?: boolean;
}

/**
 * One Selected Work entry. For a project with a built overview (BMW, NOIR),
 * "Open Experience" reaches straight into the exact same fullscreen window
 * NOTIC OS itself uses - `useOSLauncher().openProject` - so there is only
 * ever one BMW Experience and one NOIR N°01, launched the same way no
 * matter which entry point the visitor used. Projects without an overview
 * yet show their real status instead of a dead-looking preview.
 */
export function WorkCard({ project, image, reversed }: WorkCardProps) {
  const { openProject } = useOSLauncher();
  const canOpen = project.hasOverview;

  return (
    <div className="grid w-full items-center gap-8 border-t border-border py-10 lg:grid-cols-2 lg:gap-14">
      <div className={cn("relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface", reversed && "lg:order-2")}>
        {image ? (
          <GlassImage src={image} alt={`${project.name} preview`} className="h-full w-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-border">
            <span className="font-mono text-caption uppercase tracking-widest text-muted">In Development</span>
            <span className="font-mono text-caption text-muted/60">Preview not yet available</span>
          </div>
        )}
      </div>

      <div className={cn("flex flex-col items-start gap-4", reversed && "lg:order-1")}>
        <span className="font-mono text-caption text-accent-hover">
          {project.slug === "bmw" ? "01" : project.slug === "noir" ? "02" : "03"} — {project.category}
        </span>
        <h3 className="font-display text-h1 font-bold leading-none text-foreground">{project.name}</h3>
        {project.description && <p className="max-w-md text-lead text-muted">{project.description}</p>}

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-small">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-caption uppercase tracking-widest text-muted">Status</span>
            <span className="text-foreground">{project.status}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-caption uppercase tracking-widest text-muted">Year</span>
            <span className="text-foreground">{project.year}</span>
          </div>
          {project.tags && (
            <div className="flex flex-col gap-1">
              <span className="font-mono text-caption uppercase tracking-widest text-muted">Stack</span>
              <span className="text-foreground">{project.tags.slice(0, 3).join(" · ")}</span>
            </div>
          )}
        </div>

        {canOpen ? (
          <Button variant="primary" onClick={() => openProject(project.slug)} className="mt-2">
            Open Experience
          </Button>
        ) : (
          <span className="mt-2 font-mono text-caption uppercase tracking-widest text-muted">
            {project.unavailableNote ?? "Case study unavailable."}
          </span>
        )}
      </div>
    </div>
  );
}
