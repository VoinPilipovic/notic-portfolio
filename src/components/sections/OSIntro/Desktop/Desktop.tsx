"use client";

import { desktopApps, placeholderCopy } from "./osApps";
import type { PlaceholderAppId } from "./osApps";
import { DesktopIcon } from "./DesktopIcon";
import { OSWindow } from "./OSWindow";
import { PlaceholderApp } from "./PlaceholderApp";
import { SettingsApp } from "./SettingsApp";
import { SystemDashboard } from "./SystemDashboard";
import type { DesktopAppsController } from "./useDesktopApps";
import { ProjectsApp } from "../ProjectsApp";

const STACKABLE_IDS: PlaceholderAppId[] = ["experiments", "archive", "profile", "settings"];

interface DesktopProps {
  controller: DesktopAppsController;
  reduceMotion: boolean;
}

/**
 * The icon column plus every OS window instance. Projects keeps its own
 * bespoke window (built and verified separately); the other four share one
 * generic shell, so this sprint adds real, distinct destinations without
 * multiplying near-identical window code.
 */
export function Desktop({ controller, reduceMotion }: DesktopProps) {
  const { projectsOpen, openOrder, openApp, closeApp, registerIcon } = controller;

  return (
    <>
      <div className="absolute left-6 top-24 flex flex-col gap-5 sm:left-10 sm:top-28">
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            ref={(el) => registerIcon(app.id, el)}
            icon={app.icon}
            label={app.label}
            active={app.id === "projects" ? projectsOpen : openOrder.includes(app.id)}
            onClick={() => openApp(app.id)}
          />
        ))}
      </div>

      <ProjectsApp />

      <SystemDashboard />

      {STACKABLE_IDS.map((id) => {
        const app = desktopApps.find((a) => a.id === id)!;
        const isOpen = openOrder.includes(id);
        const cascadeIndex = openOrder.indexOf(id);
        return (
          <OSWindow
            key={id}
            open={isOpen}
            onClose={() => closeApp(id)}
            onFocus={() => openApp(id)}
            title={app.label}
            icon={app.icon}
            zIndex={60 + Math.max(cascadeIndex, 0)}
            reduceMotion={reduceMotion}
            cascadeIndex={cascadeIndex}
            isFocused={isOpen && cascadeIndex === openOrder.length - 1}
          >
            {id === "settings" ? (
              <SettingsApp reduceMotion={controller.reduceMotion} onReduceMotionChange={controller.setReduceMotion} />
            ) : (
              <PlaceholderApp description={placeholderCopy[id]} />
            )}
          </OSWindow>
        );
      })}
    </>
  );
}
