import type { PaymentCardData } from "@/types/banking";

import { NetworkMark } from "./NetworkMark";

interface CardFrontProps {
  card: PaymentCardData;
}

export function CardFront({ card }: CardFrontProps) {
  return (
    <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <span className="font-display text-small font-bold tracking-wide text-foreground">NOTIC PAY</span>
        <span className="font-mono text-caption uppercase tracking-widest text-foreground/50">{card.type}</span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <span aria-hidden className="flex h-6 w-8 items-center justify-center rounded-[3px] bg-gradient-to-br from-white/25 to-white/5">
            <span className="h-3.5 w-6 rounded-[2px] border border-white/30" />
          </span>
          <span className="font-mono text-body tabular tracking-[0.18em] text-foreground/90 sm:text-h2">
            {card.numberMasked}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-caption uppercase tracking-widest text-foreground/85">{card.holderName}</span>
          <span className="font-mono text-caption text-foreground/45">Exp {card.expiry}</span>
        </div>
        <NetworkMark className="h-4 w-auto text-foreground/90" />
      </div>
    </div>
  );
}
