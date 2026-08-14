"use client";

import { useRef } from "react";

import type { Recipient } from "@/types/banking";

import { RecipientAvatar } from "./RecipientAvatar";

interface AmountStepProps {
  recipient: Recipient;
  amount: string;
  note: string;
  balance: number;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onContinue: () => void;
}

export function AmountStep({ recipient, amount, note, balance, onAmountChange, onNoteChange, onContinue }: AmountStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const numeric = Number.parseFloat(amount || "0");
  const exceedsBalance = numeric > balance;
  const canContinue = numeric > 0 && !exceedsBalance;

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const safe = parts.length > 2 ? `${parts[0]}.${parts[1]}` : cleaned;
    onAmountChange(safe);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2.5">
        <RecipientAvatar recipient={recipient} size="sm" />
        <span className="font-mono text-caption uppercase tracking-widest text-muted">To {recipient.name}</span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="flex flex-col items-center gap-2 py-6 text-center"
      >
        <span
          className="flex items-baseline gap-1 font-mono font-bold tabular text-foreground"
          style={{ fontSize: "clamp(2.25rem, 1.9rem + 1.6vw, 2.75rem)", lineHeight: 1.05 }}
        >
          <span className="text-h1 text-muted">€</span>
          <input
            ref={inputRef}
            value={amount}
            onChange={(event) => handleChange(event.target.value)}
            inputMode="decimal"
            placeholder="0"
            autoFocus
            className="w-auto max-w-[10ch] border-none bg-transparent text-center outline-none placeholder:text-muted/40"
            style={{ width: `${Math.max(amount.length, 1)}ch` }}
          />
        </span>
        {exceedsBalance && <span className="text-small text-red-400">Exceeds available balance</span>}
      </button>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Note (optional)</span>
        <input
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="What's it for?"
          maxLength={40}
          className="h-12 rounded-md border border-border bg-surface px-4 text-body text-foreground placeholder:text-muted focus:border-accent"
        />
      </label>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="flex h-13 items-center justify-center rounded-md bg-accent font-medium text-background transition-colors duration-[var(--duration-base)] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Review
      </button>
    </div>
  );
}
