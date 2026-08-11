import { RevealGroup } from "@/components/shared/RevealGroup";
import { experiments } from "@/data/experiments";

import { CursorLightbox } from "./experiments/CursorLightbox";
import { DepthParallax } from "./experiments/DepthParallax";
import { GlassRefraction } from "./experiments/GlassRefraction";
import { GradientField } from "./experiments/GradientField";
import { LiquidText } from "./experiments/LiquidText";
import { MagneticType } from "./experiments/MagneticType";

const PREVIEWS = [MagneticType, GlassRefraction, DepthParallax, GradientField, CursorLightbox, LiquidText];

export function Lab() {
  return (
    <section id="lab" className="relative w-full px-gutter py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-4 pb-16">
        <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">
          NOTIC LAB
        </span>
        <h2 className="max-w-xl font-display text-h1 font-bold text-foreground">Curiosity, made interactive.</h2>
        <p className="max-w-xl text-lead text-muted">
          Small experiments, kept around instead of thrown away — move your cursor over each one.
        </p>
      </div>

      <RevealGroup
        className="mx-auto grid w-full max-w-content gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.08}
      >
        {experiments.map((experiment, i) => {
          const Preview = PREVIEWS[i];
          return (
            <div
              key={experiment.index}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <div className="h-40 overflow-hidden rounded-xl border border-border bg-background">
                <Preview />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-caption text-muted">{experiment.index}</span>
                <span className="font-mono text-caption uppercase tracking-widest text-accent-hover">
                  {experiment.tech}
                </span>
              </div>
              <h3 className="font-display text-h3 font-bold text-foreground">{experiment.title}</h3>
              <p className="text-small text-muted">{experiment.description}</p>
            </div>
          );
        })}
      </RevealGroup>
    </section>
  );
}
