"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { expandableProjectSlugs } from "@/data/osProjects";
import type { ProjectFilterId } from "@/data/osProjects";

interface OSLauncherContextValue {
  projectsOpen: boolean;
  activeSlug: string | null;
  selectedSlug: string | null;
  activeFilter: ProjectFilterId;
  /** Opens the Projects window at the list - the dock/desktop icon's own
   * entry point. */
  openProjectsList: () => void;
  /** Opens the Projects window straight into a project's fullscreen
   * overview - what a homepage "Open Experience" action calls directly,
   * skipping the list. Slug-agnostic like the rest of this system: any
   * project with `hasOverview` works the same way. */
  openProject: (slug: string) => void;
  closeProjects: () => void;
  backProjects: () => void;
  setSelectedSlug: (slug: string | null) => void;
  setActiveFilter: (filter: ProjectFilterId) => void;
}

const OSLauncherContext = createContext<OSLauncherContextValue | null>(null);

/**
 * The one piece of state that has to live above both the homepage and
 * NOTIC OS: which project (if any) is open fullscreen, and whether the
 * Projects window itself is open. Previously this lived entirely inside
 * `ProjectsApp`/`useDesktopApps`, reachable only from the OS desktop's own
 * dock and icons. Moved up here - mounted once in `layout.tsx` - so a
 * homepage "Open Experience" action can trigger the exact same window/FLIP/
 * history mechanics without a second implementation. Nothing about how the
 * window itself opens, expands or closes changes; only where the state that
 * drives it is held.
 */
export function OSLauncherProvider({ children }: { children: ReactNode }) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>("bmw");
  const [activeFilter, setActiveFilter] = useState<ProjectFilterId>("all");
  // A marker pushed onto browser history the moment a fullscreen project
  // opens, so the hardware/browser back button steps out of it the same way
  // the in-app back control does - consumed via popstate, never set directly.
  const historyPushedRef = useRef(false);

  useEffect(() => {
    if (activeSlug && expandableProjectSlugs.includes(activeSlug) && !historyPushedRef.current) {
      window.history.pushState({ noticOS: activeSlug }, "");
      historyPushedRef.current = true;
    }
  }, [activeSlug]);

  useEffect(() => {
    const onPopState = () => {
      if (!historyPushedRef.current) return;
      historyPushedRef.current = false;
      setActiveSlug(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openProjectsList = useCallback(() => {
    setProjectsOpen(true);
  }, []);

  const openProject = useCallback((slug: string) => {
    setProjectsOpen(true);
    setActiveSlug(slug);
  }, []);

  const backProjects = useCallback(() => {
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      setActiveSlug(null);
    }
  }, []);

  const closeProjects = useCallback(() => {
    if (historyPushedRef.current) window.history.back();
    setProjectsOpen(false);
    window.setTimeout(() => setActiveSlug(null), 400);
  }, []);

  return (
    <OSLauncherContext.Provider
      value={{
        projectsOpen,
        activeSlug,
        selectedSlug,
        activeFilter,
        openProjectsList,
        openProject,
        closeProjects,
        backProjects,
        setSelectedSlug,
        setActiveFilter,
      }}
    >
      {children}
    </OSLauncherContext.Provider>
  );
}

export function useOSLauncher() {
  const ctx = useContext(OSLauncherContext);
  if (!ctx) throw new Error("useOSLauncher must be used within OSLauncherProvider");
  return ctx;
}
