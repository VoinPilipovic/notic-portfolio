/** Minimal in-place loading state for a lazy-loaded tab view - reserves
 * enough height to avoid a layout jump and reads as "arriving," not a
 * generic spinner. */
export function ViewLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center">
      <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
    </div>
  );
}
