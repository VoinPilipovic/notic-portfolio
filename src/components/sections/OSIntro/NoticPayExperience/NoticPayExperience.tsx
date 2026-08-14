"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LoginScreen } from "@/components/auth/LoginScreen";
import { DesktopShell } from "@/components/dashboard/DesktopShell";
import { MobileDashboard } from "@/components/dashboard/MobileDashboard";
import { IntroSequence } from "@/components/intro/IntroSequence";

type View = "intro" | "login" | "dashboard";

interface NoticPayExperienceProps {
  onBack: () => void;
  onClose: () => void;
}

/**
 * NOTIC PAY, mounted only once the window has expanded into it - the exact
 * same standalone app (intro -> login -> dashboard, one continuous
 * client-side session, no backend) that ships on its own, just wrapped for
 * this window instead of a browser tab. `.notic-pay-scope` (see
 * src/styles/notic-pay-scope.css) isolates its own design tokens from the
 * portfolio's; this wrapper also gives it its own scroller, matching
 * BMWExperience/NOIRExperience, since ProjectsWindow's outer body is
 * `overflow-hidden` for every fullscreen project - each one owns its own
 * internal scroll rather than relying on the page underneath. `onBack`/
 * `onClose` are accepted for interface parity with BMW/NOIR (ProjectsWindow's
 * own persistent header already provides Back/Close, so nothing here needs
 * to call them itself).
 */
export function NoticPayExperience({ onBack, onClose }: NoticPayExperienceProps) {
  const [view, setView] = useState<View>("intro");
  void onBack;
  void onClose;

  return (
    <div
      className="notic-pay-scope thin-scrollbar relative h-full w-full overflow-y-auto overscroll-contain bg-background"
      data-lenis-prevent
      style={{ scrollbarGutter: "stable" }}
    >
      {view === "intro" && <IntroSequence onComplete={() => setView("login")} />}

      <AnimatePresence mode="popLayout">
        {view === "login" && (
          <motion.div
            key="login"
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <LoginScreen onSuccess={() => setView("dashboard")} />
          </motion.div>
        )}

        {view === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="lg:hidden">
              <MobileDashboard />
            </div>
            <div className="hidden h-dvh lg:block">
              <DesktopShell />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
