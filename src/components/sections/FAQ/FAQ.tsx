"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { Scene } from "@/components/shared/Scene";
import { faq } from "@/data/faq";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface FaqRowProps {
  question: string;
  answer: string;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function FaqRow({ question, answer, index, open, onToggle }: FaqRowProps) {
  const answerRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = answerRef.current;
    if (!el || !open) return;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(el, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: "sine.out" });
  }, [open, prefersReducedMotion]);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center gap-5 py-5 text-left transition-colors duration-[var(--duration-base)] ease-out-expo"
      >
        <span className="font-mono text-caption text-muted">{String(index + 1).padStart(2, "0")}</span>
        <span
          className={cn(
            "flex-1 text-small font-medium transition-colors duration-[var(--duration-base)] ease-out-expo",
            open ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
          )}
        >
          {question}
        </span>
        <Plus
          aria-hidden
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out-expo", open && "rotate-45")}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <p ref={answerRef} className="max-w-2xl pb-6 pl-9 text-small text-muted">
          {answer}
        </p>
      )}
    </div>
  );
}

/**
 * Compact question/answer index, not a wall of text - one row expanded at a
 * time (the same "click to reveal, honest empty state" grammar as the OS
 * Projects list), so the section stays short whether or not anything is
 * open.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Scene id="faq" tone="#0a0b0d" fullHeight={false} className="py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-2 pb-6">
        <span className="font-mono text-caption uppercase tracking-[0.25em] text-accent-hover">FAQ</span>
        <h2 className="max-w-xl font-display text-h1 font-bold text-foreground">Common questions.</h2>
      </div>

      <div className="mx-auto w-full max-w-content border-t border-border">
        {faq.map((entry, i) => (
          <FaqRow
            key={entry.question}
            index={i}
            question={entry.question}
            answer={entry.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
          />
        ))}
      </div>
    </Scene>
  );
}
