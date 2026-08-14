"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { MOBILE_NAV_ITEMS } from "./navItems";

interface BottomNavProps {
  activeId: string;
  onSelect: (id: string) => void;
}

/** Fixed bottom tab bar. Only "Home" has real content behind it this
 * sprint - the rest still switch (so the nav itself feels real) into an
 * honest placeholder view rather than doing nothing. */
export function BottomNav({ activeId, onSelect }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={active ? "page" : undefined}
                className="relative flex w-full flex-col items-center gap-1 py-2.5"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon
                  className={cn("h-5 w-5 transition-colors duration-[var(--duration-base)]", active ? "text-accent-hover" : "text-muted")}
                  strokeWidth={1.75}
                />
                <span
                  className={cn(
                    "font-mono text-[0.65rem] uppercase tracking-widest transition-colors duration-[var(--duration-base)]",
                    active ? "text-foreground" : "text-muted"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
