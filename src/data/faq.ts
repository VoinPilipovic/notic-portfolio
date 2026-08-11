export interface FaqEntry {
  question: string;
  answer: string;
}

// General, truthful answers only - no invented pricing, timelines or
// availability guarantees.
export const faq: FaqEntry[] = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Interactive, motion-driven websites and digital experiences - from marketing sites to fuller interactive builds. If it needs real motion, 3D or a considered interface, it's a good fit.",
  },
  {
    question: "Do you build the design and development?",
    answer:
      "Yes - direction, interface design and the production code happen in the same process, so motion and structure are designed together instead of bolted on afterward.",
  },
  {
    question: "Can you work with existing brands or designs?",
    answer:
      "Yes - an existing identity or design system can be extended into an interactive build without starting the visual direction from zero.",
  },
  {
    question: "Do you work with 3D and motion?",
    answer:
      "Yes - Three.js/WebGL and GSAP-driven motion are part of the core toolkit, used where they serve the idea rather than by default.",
  },
  {
    question: "Do you build Python / AI automation?",
    answer:
      "Yes - Python and AI tooling get used both inside the creative process and as part of what ships, when a project calls for it.",
  },
  {
    question: "How do we start a project?",
    answer:
      "Reach out through the contact section with a short outline of what you're building - the next step from there is a conversation, not a form.",
  },
];
