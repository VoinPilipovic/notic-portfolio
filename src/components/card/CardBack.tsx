import type { PaymentCardData } from "@/types/banking";

import { NetworkMark } from "./NetworkMark";

interface CardBackProps {
  card: PaymentCardData;
}

export function CardBack({ card }: CardBackProps) {
  return (
    <div className="relative flex h-full flex-col">
      {/* Magnetic stripe */}
      <div className="mt-5 h-9 w-full bg-black/55 sm:mt-7 sm:h-10" />

      <div className="flex flex-1 flex-col justify-between px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-end gap-3">
          <div className="relative h-8 flex-1 overflow-hidden rounded-[3px] bg-foreground/[0.07]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, rgba(245,243,239,0.12) 0px, rgba(245,243,239,0.12) 1px, transparent 1px, transparent 6px)",
              }}
            />
          </div>
          <div className="flex h-8 shrink-0 items-center rounded-[3px] bg-foreground/90 px-2">
            <span className="font-mono text-caption tabular text-background">•••</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-foreground/40">
            Authorized Signature · CVV
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-display text-caption font-bold tracking-wide text-foreground/85">NOTIC PAY</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-foreground/40">
              {card.holderName}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent-hover/70">
              Concept / Demo
            </span>
          </div>
          <NetworkMark className="h-3.5 w-auto text-foreground/60" />
        </div>
      </div>
    </div>
  );
}
