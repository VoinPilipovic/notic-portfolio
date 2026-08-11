export interface Capability {
  index: string;
  title: string;
  description: string;
  tools: string[];
}

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Creative Web Design",
    description: "Visual systems shaped around identity, emotion and conversion.",
    tools: ["Figma", "Responsive systems", "Art direction", "UI/UX"],
  },
  {
    index: "02",
    title: "Frontend Development",
    description: "Responsive, production-ready interfaces built to move and perform.",
    tools: ["React", "Next.js", "TypeScript", "GSAP"],
  },
  {
    index: "03",
    title: "3D & Interactive Motion",
    description: "Web experiences with depth, atmosphere and physical response.",
    tools: ["Three.js", "React Three Fiber", "WebGL", "Shaders"],
  },
  {
    index: "04",
    title: "AI-Assisted Production",
    description: "Faster concept development, visual exploration and content systems.",
    tools: ["Claude", "OpenAI", "Image/video workflows"],
  },
  {
    index: "05",
    title: "Python & Automation",
    description: "Custom tools and workflows that remove repetitive work.",
    tools: ["Python", "APIs", "Data processing", "Automation"],
  },
  {
    index: "06",
    title: "Digital Creative Direction",
    description: "Tying design, motion and code into one coherent identity.",
    tools: ["Brand systems", "Motion direction", "Art direction"],
  },
];
