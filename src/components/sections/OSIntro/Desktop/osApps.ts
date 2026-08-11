import { Archive, FlaskConical, Folder, Settings, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AppId = "projects" | "experiments" | "archive" | "profile" | "settings";
export type PlaceholderAppId = Exclude<AppId, "projects">;

export interface DesktopAppDef {
  id: AppId;
  label: string;
  icon: LucideIcon;
}

// Projects is the only one with a real, functional window this sprint - the
// rest exist honestly (they open, they say what they'll become) rather than
// as dead decoration.
export const desktopApps: DesktopAppDef[] = [
  { id: "projects", label: "Projects", icon: Folder },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "settings", label: "Settings", icon: Settings },
];

export const placeholderCopy: Record<Exclude<PlaceholderAppId, "settings">, string> = {
  experiments: "Interactive studies, motion tests and interface experiments.",
  archive: "Past concepts, unfinished directions and preserved iterations.",
  profile: "Voin Pilipović — Creative Developer working under NOTIC.",
};
