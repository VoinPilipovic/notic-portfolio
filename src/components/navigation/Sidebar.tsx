"use client";

import { motion } from "framer-motion";
import { CreditCard, LayoutGrid, LineChart, PiggyBank, Send, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "payments", label: "Payments", icon: Send },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

/** Desktop-only left navigation. "Overview" is the only real destination
 * this sprint; the rest hand off to the same honest placeholder view. */
export function Sidebar({ activeId, onSelect }: SidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col gap-8 border-r border-border px-5 py-8">
      <span className="px-2 font-display text-h2 font-bold tracking-tight text-foreground">NOTIC PAY</span>

      <nav aria-label="Primary" className="flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={active ? "page" : undefined}
              className="relative flex items-center gap-3 rounded-md px-3 py-2.5 text-left"
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-md bg-surface-raised"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <item.icon
                className={cn("relative z-10 h-4 w-4 transition-colors duration-[var(--duration-base)]", active ? "text-accent-hover" : "text-muted")}
                strokeWidth={1.75}
              />
              <span
                className={cn(
                  "relative z-10 text-small transition-colors duration-[var(--duration-base)]",
                  active ? "text-foreground" : "text-muted"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
