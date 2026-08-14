export type ProjectStatus = "Active" | "Completed" | "In Progress" | "Concept";

export interface OSProject {
  slug: string;
  name: string;
  category: string;
  year: string;
  status: ProjectStatus;
  /** Only true entries have a built overview - the rest render in the list
   * with their real status but no click-through yet, so the window never
   * promises a screen that doesn't exist. */
  hasOverview: boolean;
  /** Surfaced as a small "Featured" tag next to the name - currently only
   * true for BMW, the one project with a real experience behind it. */
  featured?: boolean;
  description?: string;
  tags?: string[];
  type?: string;
  role?: string;
  focus?: string;
  /** Shown in place of an Open Project action for projects with no built
   * overview - honest about what's there instead of a dead-looking button. */
  unavailableNote?: string;
}

export const osProjects: OSProject[] = [
  {
    slug: "bmw",
    name: "BMW Experience",
    category: "Automotive / Interactive",
    year: "2026",
    status: "Active",
    hasOverview: true,
    featured: true,
    description:
      "An interactive automotive experience built around motion, atmosphere and controlled visual pacing.",
    tags: ["Next.js", "GSAP", "Motion", "Video", "Interaction"],
    type: "Interactive Experience",
    role: "Creative Development",
    focus: "Motion / Interaction / Visual System",
  },
  {
    slug: "noir",
    name: "NOIR N°01",
    category: "Fragrance / Cinematic Campaign",
    year: "2026",
    status: "Completed",
    hasOverview: true,
    featured: true,
    description:
      "A cinematic fragrance campaign built on restraint, shadow and material presence.",
    tags: ["Next.js", "GSAP", "Art Direction", "Motion", "Photography"],
    type: "Cinematic Campaign",
    role: "Creative Direction",
    focus: "Light / Material / Restraint",
  },
  {
    slug: "casa-01",
    name: "CASA 01",
    category: "Architecture / Concept Residence",
    year: "2026",
    status: "Concept",
    hasOverview: true,
    description:
      "A concept Mediterranean residence explored through restraint, material and horizon - a cinematic architectural presentation, not a built commission.",
    tags: ["Next.js", "GSAP", "Art Direction", "Architecture"],
    type: "Architectural Concept",
    role: "Creative Direction, Development",
    focus: "Light / Material / Horizon",
  },
  {
    slug: "notic-pay",
    name: "NOTIC PAY",
    category: "Interactive Product / Fintech Concept",
    year: "2026",
    status: "Concept",
    hasOverview: true,
    featured: true,
    description:
      "A premium digital banking concept - biometric login, an interactive 3D card, real-time transfers and live analytics, built as a fully working demo product rather than static screens.",
    tags: ["Next.js", "GSAP", "Framer Motion", "Product Design", "Interaction"],
    type: "Interactive Product / Fintech Concept",
    role: "Product & Interaction Design",
    focus: "Interaction / System Design / Motion",
  },
  {
    slug: "forma",
    name: "FORMA",
    category: "Fitness / Platform",
    year: "2025",
    status: "In Progress",
    hasOverview: false,
    unavailableNote: "Currently in development.",
  },
  {
    slug: "netflix-concept",
    name: "Netflix Concept",
    category: "Streaming / Concept",
    year: "2025",
    status: "Concept",
    hasOverview: false,
    unavailableNote: "Case study unavailable.",
  },
];

// The slugs allowed to expand into a fullscreen OS experience (currently
// BMW and NOIR) - derived from the data rather than hardcoded, so adding
// the next project's overview automatically extends the FLIP/history
// integration in ProjectsWindow and ProjectsApp with no further edits there.
export const expandableProjectSlugs: string[] = osProjects
  .filter((project) => project.hasOverview)
  .map((project) => project.slug);

export type ProjectFilterId = "all" | "featured" | "in-development" | "experiments";

export const projectFilters: { id: ProjectFilterId; label: string }[] = [
  { id: "all", label: "All Projects" },
  { id: "featured", label: "Featured" },
  { id: "in-development", label: "In Development" },
  { id: "experiments", label: "Experiments" },
];

export function matchesProjectFilter(project: OSProject, filter: ProjectFilterId): boolean {
  switch (filter) {
    case "all":
      return true;
    case "featured":
      return Boolean(project.featured);
    case "in-development":
      return project.status === "In Progress";
    case "experiments":
      // Nothing lives here yet - an honest empty state beats inventing an
      // entry just to fill the category.
      return false;
  }
}
