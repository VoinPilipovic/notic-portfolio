/** A fictional, minimal payment-network mark - three ascending signal bars,
 * deliberately distinct from any real network's logo (no interlocking
 * circles, no italic wordmark). Fits NOTIC's own "signal" visual language. */
export function NetworkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" fill="none" className={className} aria-hidden>
      <rect x="0" y="11" width="6" height="9" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="11" y="6" width="6" height="14" rx="1.5" fill="currentColor" opacity="0.78" />
      <rect x="22" y="0" width="6" height="20" rx="1.5" fill="currentColor" />
    </svg>
  );
}
