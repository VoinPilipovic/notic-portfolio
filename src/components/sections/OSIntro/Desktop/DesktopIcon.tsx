import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}

/** One entry on the desktop's icon column - the same treatment the
 * Projects folder already established, generalized so all five apps share
 * one visual language instead of Projects looking like a one-off. */
export const DesktopIcon = forwardRef<HTMLButtonElement, DesktopIconProps>(function DesktopIcon(
  { icon: Icon, label, active, onClick },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={active}
      className="group flex w-20 flex-col items-center gap-2 rounded-lg py-2 transition-transform duration-[var(--duration-base)] ease-out-expo hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl border bg-surface-raised/70 shadow-elevated transition-colors duration-[var(--duration-base)] ease-out-expo group-hover:border-accent/40 group-hover:bg-surface-raised",
          active ? "border-accent/50" : "border-border"
        )}
      >
        <Icon className="h-6 w-6 text-accent-hover" strokeWidth={1.5} />
      </span>
      <span className="font-mono text-caption text-foreground/85">{label}</span>
    </button>
  );
});
