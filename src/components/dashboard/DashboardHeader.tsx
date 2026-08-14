"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  name: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({ name }: DashboardHeaderProps) {
  const firstName = name.split(" ")[0];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-raised font-display text-small font-bold text-accent-hover"
        >
          {firstName.charAt(0)}
        </span>
        <div className="flex flex-col">
          <span className="text-small text-muted">
            {getGreeting()}, {firstName}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        <span aria-hidden className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
      </button>
    </motion.header>
  );
}
