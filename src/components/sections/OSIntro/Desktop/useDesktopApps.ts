"use client";

import { useEffect, useRef, useState } from "react";

import { useOSLauncher } from "@/components/layout/OSLauncher/OSLauncherContext";

import type { AppId, PlaceholderAppId } from "./osApps";

const MOTION_STORAGE_KEY = "notic-os-reduce-motion";

/**
 * The one piece of shared state behind the desktop: which apps are open,
 * and in what stacking order. Projects is tracked separately from the
 * other four - it's already its own always-on-top, single-instance modal
 * rather than a stackable OS window, so it doesn't participate in the
 * z-order the placeholder apps share. Its open/active-project state now
 * lives in `OSLauncherContext` (so a homepage "Open Experience" action can
 * reach it too) - this hook just proxies that slice through the same
 * `projectsOpen`/`setProjectsOpen` shape it always returned, so nothing
 * downstream (Dock, DesktopIcon, OSIntro) needs to change. Owned once in
 * OSIntro and handed down to the status bar, dock and desktop icons, since
 * all three need to agree on what's open.
 */
export function useDesktopApps() {
  const launcher = useOSLauncher();
  const [openOrder, setOpenOrder] = useState<PlaceholderAppId[]>([]);
  // Lazy initializer, not an effect - this never changes what gets
  // server-rendered (the flag only ever influences imperative GSAP calls,
  // never SSR'd markup), so there's no hydration mismatch to guard against
  // here the way there is for genuinely visible content like a clock.
  const [reduceMotion, setReduceMotionState] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(MOTION_STORAGE_KEY) === "1"
  );
  const iconRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({});

  const setReduceMotion = (value: boolean) => {
    setReduceMotionState(value);
    window.localStorage.setItem(MOTION_STORAGE_KEY, value ? "1" : "0");
  };

  const registerIcon = (id: AppId, el: HTMLButtonElement | null) => {
    iconRefs.current[id] = el;
  };

  const focusIcon = (id: AppId) => {
    window.setTimeout(() => iconRefs.current[id]?.focus(), 50);
  };

  const openApp = (id: AppId) => {
    if (id === "projects") {
      launcher.openProjectsList();
      return;
    }
    // Opening an already-open window brings it to front rather than
    // duplicating it - the same "click the dock icon again" convention a
    // real desktop uses.
    setOpenOrder((prev) => [...prev.filter((a) => a !== id), id]);
  };

  const closeApp = (id: AppId) => {
    if (id === "projects") {
      launcher.closeProjects();
    } else {
      setOpenOrder((prev) => prev.filter((a) => a !== id));
    }
    focusIcon(id);
  };

  // Escape closes the topmost stackable window. Projects already runs its
  // own Escape handling (list -> back, list -> close) and always renders
  // above this system, so it takes priority whenever it's open - pressing
  // Escape shouldn't reach past it to close something underneath.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || launcher.projectsOpen) return;
      const top = openOrder[openOrder.length - 1];
      if (top) closeApp(top);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOrder, launcher.projectsOpen]);

  return {
    projectsOpen: launcher.projectsOpen,
    setProjectsOpen: (next: boolean) => (next ? launcher.openProjectsList() : launcher.closeProjects()),
    openOrder,
    openApp,
    closeApp,
    registerIcon,
    reduceMotion,
    setReduceMotion,
  };
}

export type DesktopAppsController = ReturnType<typeof useDesktopApps>;
