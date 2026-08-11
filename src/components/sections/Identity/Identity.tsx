"use client";

import { bio } from "@/data/bio";
import { Scene } from "@/components/shared/Scene";

/**
 * One compact identity statement, replacing what used to be four separate
 * full-height "story" scenes (Who Is NOTIC, How It Started, The Obsession,
 * The NOTIC Story) plus the closing Manifesto - all making a version of the
 * same point. A headline, one short paragraph covering what NOTIC actually
 * builds, and a row of factual system metadata reused directly from `bio`.
 * No essay, no scroll-triggered typing effect, no second scene needed.
 */
export function Identity() {
  return (
    <Scene id="identity" tone="#0a0c10" fullHeight={false} className="py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-7">
        <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">
          System — Identity
        </span>

        <h2 className="max-w-3xl font-display text-h1 font-bold leading-[1.1] text-foreground">
          I&rsquo;m not building a portfolio. I&rsquo;m building proof.
        </h2>

        <p className="max-w-2xl text-lead text-muted">
          I&rsquo;m {bio.name.split(" ")[0]}, working under {bio.handle} — a {bio.role.toLowerCase()} building
          interactive, animated websites: motion-driven interfaces, 3D and WebGL experiences, and the
          Python/AI tooling that speeds up how they get made.
        </p>

        <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
          {bio.facts.map((fact) => (
            <li key={fact} className="font-mono text-caption uppercase tracking-widest text-muted">
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
