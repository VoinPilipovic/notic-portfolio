import { cn } from "@/lib/utils";

import { desktopApps } from "./osApps";
import type { AppId, PlaceholderAppId } from "./osApps";

interface DockProps {
  projectsOpen: boolean;
  openOrder: PlaceholderAppId[];
  onOpen: (id: AppId) => void;
}

/** The dock reads the same open-state the desktop icons do, so both entry
 * points always agree on what's running. Hover is a small lift, not a
 * magnification curve - restrained on purpose. */
export function Dock({ projectsOpen, openOrder, onOpen }: DockProps) {
  return (
    <div className="glass flex items-center gap-2 rounded-full px-4 py-3">
      {desktopApps.map((app) => {
        const isActive = app.id === "projects" ? projectsOpen : openOrder.includes(app.id);
        const Icon = app.icon;
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpen(app.id)}
            aria-label={`Open ${app.label}`}
            aria-pressed={isActive}
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ease-out-expo hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isActive ? "text-accent-hover" : "text-muted group-hover:text-foreground"
              )}
              strokeWidth={1.6}
            />
            <span
              aria-hidden
              className={cn(
                "absolute -bottom-1 h-1 w-1 rounded-full bg-accent transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
