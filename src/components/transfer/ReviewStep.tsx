import type { Recipient } from "@/types/banking";
import { formatCurrency } from "@/lib/utils";

import { RecipientAvatar } from "./RecipientAvatar";

interface ReviewStepProps {
  recipient: Recipient;
  amount: number;
  note: string;
  balance: number;
  onSend: () => void;
}

export function ReviewStep({ recipient, amount, note, balance, onSend }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="font-display text-h1 font-bold text-foreground">Review transfer</span>
        <span className="text-small text-muted">Confirm the details before sending</span>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-4">
        <RecipientAvatar recipient={recipient} />
        <div className="flex flex-1 flex-col">
          <span className="font-medium text-foreground">{recipient.name}</span>
          <span className="font-mono text-caption text-muted">Recipient</span>
        </div>
        <span className="font-mono text-h2 tabular font-bold text-foreground">{formatCurrency(amount)}</span>
      </div>

      <dl className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <dt className="font-mono text-caption uppercase tracking-widest text-muted">Available Balance</dt>
          <dd className="font-mono text-small tabular text-foreground">{formatCurrency(balance)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="font-mono text-caption uppercase tracking-widest text-muted">Balance After</dt>
          <dd className="font-mono text-small tabular text-foreground">{formatCurrency(balance - amount)}</dd>
        </div>
        {note && (
          <div className="flex items-center justify-between gap-4">
            <dt className="font-mono text-caption uppercase tracking-widest text-muted">Note</dt>
            <dd className="truncate text-small text-foreground">{note}</dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={onSend}
        className="flex h-13 items-center justify-center rounded-md bg-accent font-medium text-background transition-colors duration-[var(--duration-base)] hover:bg-accent-hover"
      >
        Send {formatCurrency(amount)}
      </button>
    </div>
  );
}
