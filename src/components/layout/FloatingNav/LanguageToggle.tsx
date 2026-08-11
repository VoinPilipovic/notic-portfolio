"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// Visual placeholder per the confirmed scope decision: a real, interactive
// toggle with working active/hover states, but no i18n content pipeline yet
// - the site stays English-only regardless of which option is active.
const LOCALES = ["EN", "FR"] as const;

export function LanguageToggle() {
  const [active, setActive] = useState<(typeof LOCALES)[number]>("EN");

  return (
    <div className="flex items-center gap-1.5 text-caption uppercase tracking-widest">
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border">/</span>}
          <button
            type="button"
            onClick={() => setActive(locale)}
            aria-pressed={active === locale}
            className={cn(
              "transition-colors duration-[var(--duration-base)] ease-out-expo",
              active === locale ? "text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            {locale}
          </button>
        </span>
      ))}
    </div>
  );
}
