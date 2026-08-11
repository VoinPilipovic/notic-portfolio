import { Scene } from "@/components/shared/Scene";
import { bmwImages } from "@/components/sections/OSIntro/BMWExperience/bmwAssets";
import { noirImages } from "@/components/sections/OSIntro/NOIRExperience/noirAssets";
import { osProjects } from "@/data/osProjects";

import { WorkCard } from "./WorkCard";

const PREVIEW_IMAGES: Record<string, string> = {
  bmw: bmwImages.fogHero,
  noir: noirImages.heroSmoke,
};

// Only the projects worth surfacing on the homepage: the two built
// experiences, plus the one honestly-labelled in-development entry - never
// the unlaunched concept slug.
const FEATURED_SLUGS = ["bmw", "noir", "forma"];

/**
 * Real work, moved up and given room. Every entry here is the same
 * `osProjects` data NOTIC OS's own Projects window reads - "Open
 * Experience" opens the exact same fullscreen BMW/NOIR window, not a
 * separate homepage-only preview.
 */
export function SelectedWork() {
  const projects = FEATURED_SLUGS.map((slug) => osProjects.find((p) => p.slug === slug)!).filter(Boolean);

  return (
    <Scene id="work" tone="#0a0c10" fullHeight={false} className="py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-2 pb-6">
        <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">Selected Work</span>
        <h2 className="max-w-xl font-display text-h1 font-bold text-foreground">
          Two built experiences. One in progress.
        </h2>
      </div>

      <div className="mx-auto flex w-full max-w-content flex-col">
        {projects.map((project, i) => (
          <WorkCard key={project.slug} project={project} image={PREVIEW_IMAGES[project.slug]} reversed={i % 2 === 1} />
        ))}
      </div>
    </Scene>
  );
}
