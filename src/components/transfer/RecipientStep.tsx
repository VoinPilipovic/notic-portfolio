import { motion } from "framer-motion";

import { recipients } from "@/data/mockBankingData";
import type { Recipient } from "@/types/banking";

import { RecipientAvatar } from "./RecipientAvatar";

interface RecipientStepProps {
  onSelect: (recipient: Recipient) => void;
}

export function RecipientStep({ onSelect }: RecipientStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="font-display text-h1 font-bold text-foreground">Send money</span>
        <span className="text-small text-muted">Choose a recipient</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {recipients.map((recipient) => (
          <motion.button
            key={recipient.id}
            type="button"
            onClick={() => onSelect(recipient)}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2 }}
            className="flex flex-col items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-5 transition-colors duration-[var(--duration-base)] hover:border-accent/40"
          >
            <RecipientAvatar recipient={recipient} size="lg" />
            <span className="font-medium text-foreground">{recipient.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
