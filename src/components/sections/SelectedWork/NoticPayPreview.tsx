/**
 * NOTIC PAY's Selected Work preview - there's no photography to show (it's
 * a product UI, not a photo shoot), so this is a small, genuine on-brand
 * treatment instead: NOTIC PAY's own near-black/ivory/cool-blue palette and
 * its own corner-bracket + network-mark motifs (the same visual language
 * the experience itself uses), not a placeholder and not borrowed imagery.
 */
export function NoticPayPreview() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(155deg, #14161a 0%, #0d0e10 55%, #08090b 100%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(245,243,239,0.5) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 sm:h-40 sm:w-40">
        <span className="absolute left-2.5 top-2.5 h-3.5 w-3.5 rounded-tl-md border-l border-t border-[#6e9fc8]/70" />
        <span className="absolute right-2.5 top-2.5 h-3.5 w-3.5 rounded-tr-md border-r border-t border-[#6e9fc8]/70" />
        <span className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 rounded-bl-md border-b border-l border-[#6e9fc8]/70" />
        <span className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 rounded-br-md border-b border-r border-[#6e9fc8]/70" />

        <div className="flex flex-col items-center gap-3">
          <span
            className="font-display text-lg font-bold tracking-tight text-[#f5f3ef] sm:text-xl"
            style={{ fontFamily: "var(--font-syne), ui-sans-serif, system-ui, sans-serif" }}
          >
            NOTIC PAY
          </span>
          <svg viewBox="0 0 28 20" fill="none" className="h-3 w-auto text-[#f5f3ef]/70" aria-hidden>
            <rect x="0" y="11" width="6" height="9" rx="1.5" fill="currentColor" opacity="0.55" />
            <rect x="11" y="6" width="6" height="14" rx="1.5" fill="currentColor" opacity="0.78" />
            <rect x="22" y="0" width="6" height="20" rx="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      <span
        className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[#8a8d91]"
        style={{ fontFamily: "var(--font-ibm-plex-mono), ui-monospace, monospace" }}
      >
        Digital Banking Concept
      </span>
    </div>
  );
}
