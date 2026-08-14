export function ConceptBadge({ className }: { className?: string }) {
  return (
    <p className={`font-mono text-caption uppercase tracking-widest text-muted/70 ${className ?? ""}`}>
      NOTIC PAY — Concept / Demo
    </p>
  );
}
