"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Recipient } from "@/types/banking";
import { cn } from "@/lib/utils";

import { AmountStep } from "./AmountStep";
import { RecipientStep } from "./RecipientStep";
import { ReviewStep } from "./ReviewStep";
import { SuccessStep } from "./SuccessStep";
import { TransferAnimation } from "./TransferAnimation";

type Step = "recipient" | "amount" | "review" | "sending" | "success";

interface SendMoneyFlowProps {
  presentation: "sheet" | "modal";
  balance: number;
  onClose: () => void;
  onComplete: (recipient: Recipient, amount: number, note: string) => void;
}

const stepVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

/**
 * Recipient -> amount -> review -> transfer animation -> success. One
 * component, two presentations (a full-screen mobile sheet, a centered
 * desktop modal) so the step logic never has to be written twice.
 */
export function SendMoneyFlow({ presentation, balance, onClose, onComplete }: SendMoneyFlowProps) {
  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const prefersReducedMotion = usePrefersReducedMotion();

  const numericAmount = Number.parseFloat(amount || "0");
  const canGoBack = step === "amount" || step === "review";
  const canClose = step !== "sending";

  const handleBack = () => {
    if (step === "amount") setStep("recipient");
    else if (step === "review") setStep("amount");
  };

  const handleSend = () => {
    setStep("sending");
  };

  const handleTransferComplete = () => {
    if (recipient) onComplete(recipient, numericAmount, note);
    setStep("success");
  };

  const panelInitial =
    presentation === "sheet" ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 12 };
  const panelAnimate = presentation === "sheet" ? { y: 0 } : { opacity: 1, scale: 1, y: 0 };
  const panelExit = presentation === "sheet" ? { y: "100%" } : { opacity: 0, scale: 0.97, y: 8 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
      onClick={canClose ? onClose : undefined}
      className={cn(
        "fixed inset-0 z-40 flex bg-background/70",
        presentation === "sheet" ? "items-end" : "items-center justify-center p-6"
      )}
    >
      <motion.div
        initial={prefersReducedMotion ? undefined : panelInitial}
        animate={prefersReducedMotion ? undefined : panelAnimate}
        exit={prefersReducedMotion ? undefined : panelExit}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "glass-strong flex flex-col overflow-hidden",
          presentation === "sheet"
            ? "max-h-[92dvh] w-full rounded-t-2xl px-gutter pb-8 pt-4"
            : "max-h-[85vh] w-full max-w-md rounded-2xl p-6"
        )}
      >
        <div className="mb-2 flex shrink-0 items-center justify-between">
          {canGoBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ) : (
            <span />
          )}
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors duration-[var(--duration-base)] hover:border-accent/40 hover:text-accent-hover"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <div className="overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === "recipient" && (
              <motion.div key="recipient" {...(prefersReducedMotion ? {} : stepVariants)} transition={{ duration: 0.22 }}>
                <RecipientStep
                  onSelect={(r) => {
                    setRecipient(r);
                    setStep("amount");
                  }}
                />
              </motion.div>
            )}

            {step === "amount" && recipient && (
              <motion.div key="amount" {...(prefersReducedMotion ? {} : stepVariants)} transition={{ duration: 0.22 }}>
                <AmountStep
                  recipient={recipient}
                  amount={amount}
                  note={note}
                  balance={balance}
                  onAmountChange={setAmount}
                  onNoteChange={setNote}
                  onContinue={() => setStep("review")}
                />
              </motion.div>
            )}

            {step === "review" && recipient && (
              <motion.div key="review" {...(prefersReducedMotion ? {} : stepVariants)} transition={{ duration: 0.22 }}>
                <ReviewStep recipient={recipient} amount={numericAmount} note={note} balance={balance} onSend={handleSend} />
              </motion.div>
            )}

            {step === "sending" && recipient && (
              <motion.div key="sending" {...(prefersReducedMotion ? {} : stepVariants)} transition={{ duration: 0.22 }}>
                <TransferAnimation recipient={recipient} amount={numericAmount} onComplete={handleTransferComplete} />
              </motion.div>
            )}

            {step === "success" && recipient && (
              <motion.div key="success" {...(prefersReducedMotion ? {} : stepVariants)} transition={{ duration: 0.22 }}>
                <SuccessStep recipient={recipient} amount={numericAmount} onDone={onClose} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
