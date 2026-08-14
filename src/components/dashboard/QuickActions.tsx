"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Plus, Snowflake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuickActionsProps {
  frozen: boolean;
  onToggleFreeze: () => void;
  onSend: () => void;
}

interface Action {
  id: string;
  label: string;
  icon: LucideIcon;
}

const ACTIONS: Action[] = [
  { id: "send", label: "Send", icon: ArrowUpRight },
  { id: "request", label: "Request", icon: ArrowDownLeft },
  { id: "add", label: "Add money", icon: Plus },
  { id: "freeze", label: "Freeze", icon: Snowflake },
];

/**
 * Send opens the full transfer flow (Sprint 2). Request/Add money are still
 * demo-only - a small inline message confirms the tap registered rather
 * than doing nothing. Freeze is wired to real (local, visual-only) state:
 * it desaturates the card and shows a "Frozen" overlay.
 */
export function QuickActions({ frozen, onToggleFreeze, onSend }: QuickActionsProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(noticeTimeout.current);
  }, []);

  const handlePress = (action: Action) => {
    if (action.id === "send") {
      onSend();
      return;
    }
    if (action.id === "freeze") {
      onToggleFreeze();
      setNotice(frozen ? "Card unfrozen" : "Card frozen");
    } else {
      setNotice("Demo module · not active");
    }
    window.clearTimeout(noticeTimeout.current);
    noticeTimeout.current = window.setTimeout(() => setNotice(null), 1800);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {ACTIONS.map((action) => {
          const isFreeze = action.id === "freeze";
          const active = isFreeze && frozen;
          return (
            <motion.button
              key={action.id}
              type="button"
              onClick={() => handlePress(action)}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center gap-2 rounded-lg py-2"
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-[var(--duration-base)]",
                  active ? "border-accent/50 bg-accent-dim/60 text-accent-hover" : "border-border bg-surface text-foreground"
                )}
              >
                <action.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="font-mono text-caption uppercase tracking-wide text-muted">{action.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="h-4">
        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center font-mono text-caption text-accent-hover"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
