export interface ExperimentMeta {
  index: string;
  title: string;
  description: string;
  tech: string;
}

// Metadata only - each experiment's actual interactive preview is its own
// component under Lab/experiments/, wired up directly in Lab.tsx.
export const experiments: ExperimentMeta[] = [
  {
    index: "01",
    title: "Magnetic Type",
    description: "Letters pull toward the cursor like they have their own gravity.",
    tech: "GSAP quickTo",
  },
  {
    index: "02",
    title: "Glass Refraction",
    description: "An SVG displacement field standing in for a pane of moving glass.",
    tech: "SVG feDisplacementMap",
  },
  {
    index: "03",
    title: "Depth Parallax",
    description: "A flat image that tilts against the cursor as if it had real depth.",
    tech: "CSS 3D transform",
  },
  {
    index: "04",
    title: "Gradient Field",
    description: "A slow animated mesh of light, never quite settling into one shape.",
    tech: "CSS conic-gradient",
  },
  {
    index: "05",
    title: "Cursor Light",
    description: "A soft navy glow that follows the pointer around a dark plane.",
    tech: "GSAP + radial-gradient",
  },
  {
    index: "06",
    title: "Liquid Text",
    description: "Headline text that ripples outward from wherever you last moved.",
    tech: "SVG turbulence",
  },
];
