"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { Button } from "@/components/ui/Button";
import {
  matchesProjectFilter,
  osProjects,
  projectFilters,
} from "@/data/osProjects";
import type { OSProject, ProjectFilterId, ProjectStatus } from "@/data/osProjects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { bmwImages } from "./BMWExperience/bmwAssets";
import { casaImages } from "./CASA01Experience/casaAssets";
import { noirImages } from "./NOIRExperience/noirAssets";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Active: "border-accent/40 text-accent-hover",
  "In Progress": "border-warm/40 text-warm",
  Completed: "border-border text-silver",
  Concept: "border-border text-muted",
};

// Real photography for the projects that have a built experience behind
// them; everything else falls back to a plain monogram rather than a
// borrowed or generic image.
const ROW_THUMBNAILS: Record<string, { src: string; alt: string }> = {
  bmw: { src: bmwImages.fogHero, alt: "" },
  noir: { src: noirImages.heroSmoke, alt: "" },
  "casa-01": { src: casaImages.hero, alt: "" },
};

// A brief highlight on the launched project before BMW actually opens - long
// enough to register as "this one was chosen," short enough to never feel
// like a wait.
const OPEN_DELAY_MS = 190;

interface ProjectsListProps {
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  activeFilter: ProjectFilterId;
  onFilterChange: (filter: ProjectFilterId) => void;
  onOpenProject: (slug: string) => void;
}

/**
 * A sidebar of filters plus a stacked row list, each row expanding in place
 * into a small inspector rather than jumping to a separate detail screen -
 * one layout that already works as a mobile stacked section without a
 * second implementation. Closer to Linear's issue list than a portfolio
 * gallery, because this is a workspace looking at its own projects.
 */
export function ProjectsList({
  selectedSlug,
  onSelect,
  activeFilter,
  onFilterChange,
  onOpenProject,
}: ProjectsListProps) {
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const filtered = osProjects.filter((project) => matchesProjectFilter(project, activeFilter));
  const activeCount = osProjects.filter((project) => project.status === "Active").length;

  const handleLaunch = (slug: string) => {
    if (pendingSlug) return;
    setPendingSlug(slug);
    window.setTimeout(() => onOpenProject(slug), OPEN_DELAY_MS);
  };

  // A very slight stagger as the (filtered) list settles - not a per-row
  // fade-up on every scroll, just a quiet cue that the list just changed.
  useEffect(() => {
    const rows = listRef.current?.children;
    if (!rows || rows.length === 0) return;
    if (prefersReducedMotion) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      rows,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "sine.out" }
    );
  }, [activeFilter, prefersReducedMotion]);

  return (
    <div className="flex h-full flex-col sm:flex-row">
      <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-border px-4 py-3 sm:w-44 sm:flex-col sm:items-stretch sm:gap-1 sm:overflow-visible sm:border-b-0 sm:border-r sm:px-3 sm:py-6">
        <div className="hidden shrink-0 flex-col gap-1 px-3 pb-5 sm:flex">
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-muted">Projects</span>
          <span className="font-mono text-caption text-foreground/70">
            {osProjects.length} Projects · {activeCount} Active
          </span>
        </div>
        {projectFilters.map((filter) => {
          const active = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              aria-pressed={active}
              className={cn(
                "relative shrink-0 whitespace-nowrap rounded-md py-2 pl-3.5 pr-3 text-left font-mono text-caption uppercase tracking-widest transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active ? "bg-surface-raised/70 text-accent-hover" : "text-muted hover:bg-surface-raised/30 hover:text-foreground"
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-1.5 left-0 w-px rounded-full bg-accent-hover sm:inset-y-2"
                />
              )}
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="thin-scrollbar flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <span className="font-mono text-caption uppercase tracking-widest text-muted">Nothing here yet</span>
            <p className="max-w-xs text-small text-muted">
              New experiments will appear in this view once they&rsquo;re ready to share.
            </p>
          </div>
        ) : (
          <div ref={listRef}>
            {filtered.map((project) => (
              <ProjectRow
                key={project.slug}
                project={project}
                selected={selectedSlug === project.slug}
                pending={pendingSlug === project.slug}
                busy={pendingSlug !== null}
                onToggle={() => onSelect(selectedSlug === project.slug ? null : project.slug)}
                onLaunch={() => handleLaunch(project.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectRowProps {
  project: OSProject;
  selected: boolean;
  pending: boolean;
  busy: boolean;
  onToggle: () => void;
  onLaunch: () => void;
}

function ProjectRow({ project, selected, pending, busy, onToggle, onLaunch }: ProjectRowProps) {
  const inspectorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const inspector = inspectorRef.current;
    if (!inspector) return;
    if (prefersReducedMotion) {
      gsap.set(inspector, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(inspector, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: "sine.out" });
  }, [prefersReducedMotion]);

  const index = String(osProjects.indexOf(project) + 1).padStart(2, "0");

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={selected}
        className="group flex w-full items-center gap-4 px-6 py-6 text-left transition-colors duration-200 ease-out-expo hover:bg-surface-raised/40 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:px-8"
      >
        {ROW_THUMBNAILS[project.slug] ? (
          <span
            className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border"
            style={{ boxShadow: "inset 0 0 0 1px rgba(248,245,242,0.04)" }}
          >
            <Image
              src={ROW_THUMBNAILS[project.slug].src}
              alt={ROW_THUMBNAILS[project.slug].alt}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-110"
            />
          </span>
        ) : (
          <span
            aria-hidden
            className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised/40 font-mono text-caption uppercase text-muted"
          >
            {project.name.slice(0, 2)}
          </span>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex flex-wrap items-baseline gap-x-2.5">
            <span className="font-mono text-caption tabular text-muted">{index}</span>
            <span className="truncate text-h3 font-bold text-foreground">{project.name}</span>
            {project.featured && (
              <span className="font-mono text-caption uppercase tracking-widest text-accent-hover">Featured</span>
            )}
          </span>
          <span className="font-mono text-caption uppercase tracking-widest text-muted">
            {project.category} — {project.year}
          </span>
        </div>

        <span
          className={cn(
            "hidden shrink-0 rounded-full border px-3 py-1 font-mono text-caption uppercase tracking-widest sm:inline-block",
            STATUS_STYLES[project.status]
          )}
        >
          {project.status}
        </span>

        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out-expo",
            selected && "rotate-180"
          )}
        />
      </button>

      {selected && (
        <div ref={inspectorRef} className="border-t border-border bg-surface/40 px-6 py-6 sm:px-8">
          <span
            className={cn(
              "mb-4 inline-block rounded-full border px-3 py-1 font-mono text-caption uppercase tracking-widest sm:hidden",
              STATUS_STYLES[project.status]
            )}
          >
            {project.status}
          </span>

          {project.description && <p className="max-w-lg text-body text-foreground">{project.description}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <dt className="font-mono text-caption uppercase tracking-widest text-muted">Status</dt>
              <dd className="text-small text-foreground">{project.status}</dd>
            </div>
            {project.type && (
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-caption uppercase tracking-widest text-muted">Type</dt>
                <dd className="text-small text-foreground">{project.type}</dd>
              </div>
            )}
            {project.role && (
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-caption uppercase tracking-widest text-muted">Role</dt>
                <dd className="text-small text-foreground">{project.role}</dd>
              </div>
            )}
            {project.focus && (
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-caption uppercase tracking-widest text-muted">Focus</dt>
                <dd className="text-small text-foreground">{project.focus}</dd>
              </div>
            )}
          </dl>

          {project.tags && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 bg-surface-raised/50 px-3 py-1 font-mono text-caption uppercase tracking-widest text-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7">
            {project.hasOverview ? (
              <Button
                type="button"
                disabled={busy}
                onClick={onLaunch}
                variant="primary"
                className={pending ? "text-accent-hover after:bg-accent-hover" : undefined}
              >
                Open Project
              </Button>
            ) : (
              <span className="font-mono text-caption uppercase tracking-widest text-muted">
                {project.unavailableNote ?? "Case study unavailable."}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
