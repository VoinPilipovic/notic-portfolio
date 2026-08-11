interface PlaceholderAppProps {
  description: string;
}

/** An honest placeholder, not a dead end - it says what the app is for and
 * that it's still being built, rather than pretending to be finished. */
export function PlaceholderApp({ description }: PlaceholderAppProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body text-foreground">{description}</p>
      <div className="flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warm" />
        <span className="font-mono text-caption uppercase tracking-widest text-muted">In development</span>
      </div>
    </div>
  );
}
