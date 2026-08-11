import { RevealGroup } from "@/components/shared/RevealGroup";
import { Scene } from "@/components/shared/Scene";
import { bio } from "@/data/bio";

const DETAILS = [
  { label: "Name", value: bio.name },
  { label: "Role", value: bio.role },
  { label: "Location", value: bio.location },
  { label: "Background", value: bio.background },
  { label: "Availability", value: bio.availability },
];

/**
 * A concise, factual profile - no portrait, no autobiography. `whoami`
 * frames it as a system query rather than an "About Me" essay: a terminal
 * line, then exactly the facts already established in `bio`.
 */
export function About() {
  return (
    <Scene id="about" tone="#0d0f14" fullHeight={false} className="py-section">
      <RevealGroup className="mx-auto flex w-full max-w-content flex-col gap-6" stagger={0.08}>
        <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">Profile</span>

        <p className="font-mono text-small text-muted">
          PS C:\NOTIC&gt; whoami
        </p>

        <h2 className="font-display text-h1 font-bold text-foreground">{bio.name}</h2>

        <dl className="flex flex-col gap-4 border-t border-border pt-6 sm:max-w-xl">
          {DETAILS.map((item) => (
            <div key={item.label} className="grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[9rem_1fr]">
              <dt className="font-mono text-caption uppercase tracking-widest text-muted">{item.label}</dt>
              <dd className="text-small text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </RevealGroup>
    </Scene>
  );
}
