"use client";

import { createPortal } from "react-dom";

import { useOSLauncher } from "@/components/layout/OSLauncher/OSLauncherContext";
import { useMounted } from "@/hooks/useMounted";

import { ProjectsWindow } from "./ProjectsWindow";

/**
 * Projects' own window, portaled to `document.body` so its opacity/motion
 * is never at the mercy of the OS section's scroll-scrubbed ancestors.
 * Every piece of state that used to live here (which project is active,
 * the list's own selection/filter, browser-history integration) now lives
 * in `OSLauncherContext`, so the exact same window can be launched from
 * either the OS desktop or the homepage's Selected Work section - this
 * component just renders it.
 */
export function ProjectsApp() {
  const { projectsOpen, activeSlug, openProject, backProjects, closeProjects, selectedSlug, setSelectedSlug, activeFilter, setActiveFilter } =
    useOSLauncher();
  const mounted = useMounted();

  if (!mounted) return null;

  return createPortal(
    <ProjectsWindow
      open={projectsOpen}
      activeSlug={activeSlug}
      onOpenProject={openProject}
      onBack={backProjects}
      onClose={closeProjects}
      selectedSlug={selectedSlug}
      onSelectProject={setSelectedSlug}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />,
    document.body
  );
}
