"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PlaceholderViewProps {
  icon: LucideIcon;
  label: string;
}

/** Honest stand-in for the screens Sprint 1 doesn't build yet - a real
 * destination, clearly labelled, instead of a dead tab. */
export function PlaceholderView({ icon: Icon, label }: PlaceholderViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border text-muted">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="font-display text-h2 font-bold text-foreground">{label}</span>
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Demo Module · Not Active</span>
      </div>
    </motion.div>
  );
}
