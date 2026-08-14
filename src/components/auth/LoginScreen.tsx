"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ScanFace } from "lucide-react";

import { demoCredentials } from "@/data/mockBankingData";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { BiometricScanner } from "./BiometricScanner";

interface LoginScreenProps {
  onSuccess: () => void;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Mobile-first demo login. Fields come prefilled with the visible demo
 * credentials - this is a portfolio concept, not real auth, so the goal is
 * zero friction to reach the dashboard while still running a real (mock)
 * validation path.
 */
export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [demoId, setDemoId] = useState(demoCredentials.demoId);
  const [pin, setPin] = useState(demoCredentials.pin);
  const [error, setError] = useState(false);
  const [scanning, setScanning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const validate = () => demoId.trim() === demoCredentials.demoId && pin.trim() === demoCredentials.pin;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (validate()) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleBiometric = () => {
    if (scanning) return;
    setScanning(true);
  };

  // The scanner's own exit fade finishes inside its ~0.8s timeline, before
  // onVerified fires - so it can be unmounted immediately rather than
  // lingering (already-invisible, but still a full-viewport fixed layer)
  // through the parent's own ~0.4s exit transition. Three concurrent
  // full-viewport animations (its fade, the login blur-exit, the dashboard
  // fade-in) were enough concurrent compositing work to visibly delay the
  // dashboard actually appearing, well past the scanner's own ~0.8s budget.
  const handleVerified = () => {
    setScanning(false);
    onSuccess();
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={prefersReducedMotion ? undefined : container}
      className="flex min-h-dvh w-full flex-col justify-center px-gutter py-12 sm:mx-auto sm:max-w-sm"
    >
      <motion.div variants={prefersReducedMotion ? undefined : item} className="flex flex-col items-start gap-1">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">NOTIC PAY</span>
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Digital Banking Concept</span>
      </motion.div>

      <motion.span
        variants={prefersReducedMotion ? undefined : item}
        className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/25 bg-accent-dim/40 px-3 py-1 font-mono text-caption uppercase tracking-widest text-accent-hover"
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-hover" />
        Demo Environment
      </motion.span>

      <motion.h1 variants={prefersReducedMotion ? undefined : item} className="mt-8 text-h1 font-semibold text-foreground">
        Welcome back
      </motion.h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <motion.label variants={prefersReducedMotion ? undefined : item} className="flex flex-col gap-2">
          <span className="font-mono text-caption uppercase tracking-widest text-muted">Card Number / Demo ID</span>
          <input
            value={demoId}
            onChange={(event) => setDemoId(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            className={cn(
              "h-13 rounded-md border border-border bg-surface px-4 font-mono text-body tabular text-foreground transition-colors duration-[var(--duration-base)] placeholder:text-muted focus:border-accent",
              error && "border-red-400/50"
            )}
          />
        </motion.label>

        <motion.label variants={prefersReducedMotion ? undefined : item} className="flex flex-col gap-2">
          <span className="font-mono text-caption uppercase tracking-widest text-muted">PIN</span>
          <input
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            type="password"
            inputMode="numeric"
            maxLength={4}
            autoComplete="off"
            className={cn(
              "h-13 rounded-md border border-border bg-surface px-4 font-mono text-body tabular tracking-[0.4em] text-foreground transition-colors duration-[var(--duration-base)] placeholder:text-muted focus:border-accent",
              error && "border-red-400/50"
            )}
          />
        </motion.label>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-mt-2 text-small text-red-400">
            Invalid demo credentials - use the values shown above.
          </motion.p>
        )}

        <motion.button
          variants={prefersReducedMotion ? undefined : item}
          type="submit"
          disabled={scanning}
          whileTap={{ scale: 0.98 }}
          className="mt-2 flex h-13 items-center justify-center rounded-md bg-accent font-medium text-background transition-colors duration-[var(--duration-base)] hover:bg-accent-hover disabled:opacity-50"
        >
          Enter Demo
        </motion.button>

        <motion.button
          variants={prefersReducedMotion ? undefined : item}
          type="button"
          onClick={handleBiometric}
          disabled={scanning}
          whileTap={{ scale: 0.98 }}
          className="flex h-13 items-center justify-center gap-2 rounded-md border border-border font-medium text-foreground transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover disabled:opacity-50"
        >
          <ScanFace className={cn("h-4 w-4", scanning && "text-accent-hover")} strokeWidth={1.75} />
          Face ID / Biometric Demo
        </motion.button>
      </form>

      <motion.p variants={prefersReducedMotion ? undefined : item} className="mt-8 text-center font-mono text-caption text-muted">
        Demo ID {demoCredentials.demoId} · PIN {demoCredentials.pin}
      </motion.p>

      {scanning && <BiometricScanner onVerified={handleVerified} />}
    </motion.div>
  );
}
