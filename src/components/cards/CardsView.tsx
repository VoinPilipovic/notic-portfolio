import { Banknote, CreditCard as CreditCardIcon, Globe, Snowflake, Wifi } from "lucide-react";

import { PaymentCard } from "@/components/card/PaymentCard";
import { formatCurrency } from "@/lib/utils";
import type { CardControls, CardDetails, PaymentCardData } from "@/types/banking";

import { CardControlToggle } from "./CardControlToggle";
import { CardDetailsReveal } from "./CardDetailsReveal";
import { SpendingLimitControl } from "./SpendingLimitControl";

interface CardsViewProps {
  card: PaymentCardData;
  cardDetails: CardDetails;
  balance: number;
  frozen: boolean;
  onToggleFreeze: () => void;
  controls: CardControls;
  onControlsChange: (next: CardControls) => void;
}

/** Physical card control - the one reason this page exists. Reuses the
 * exact PaymentCard component and drag interaction from Home; everything
 * below it is local demo state for freezing, channel toggles, a spending
 * limit and a privacy-aware details reveal. */
export function CardsView({
  card,
  cardDetails,
  balance,
  frozen,
  onToggleFreeze,
  controls,
  onControlsChange,
}: CardsViewProps) {
  const patch = (partial: Partial<CardControls>) => onControlsChange({ ...controls, ...partial });

  return (
    <div className="flex flex-col gap-8 pb-2">
      <div className="flex flex-col gap-1">
        <span className="font-display text-h1 font-bold text-foreground">Cards</span>
        <span className="text-small text-muted">Manage your NOTIC PAY card</span>
      </div>

      {/* Single column on mobile/tablet; on wide desktop the card + status
          sit in a fixed-width left column beside the controls, rather than
          everything staying stacked under a lot of unused width. */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
        <div className="flex flex-col gap-6 xl:w-[360px] xl:shrink-0">
          <div className="mx-auto w-full max-w-sm xl:mx-0 xl:max-w-none">
            <PaymentCard card={card} frozen={frozen} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Status" value={frozen ? "Frozen" : "Active"} accent={!frozen} />
            <InfoTile label="Available" value={formatCurrency(balance)} />
            <InfoTile label="Cardholder" value={card.holderName} />
            <InfoTile label="Expires" value={card.expiry} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface px-4">
            <CardControlToggle
              icon={Snowflake}
              label="Freeze card"
              description="Block all new activity instantly"
              checked={frozen}
              onChange={onToggleFreeze}
            />
            <CardControlToggle
              icon={Globe}
              label="Online payments"
              description="Web and in-app purchases"
              checked={controls.onlinePayments}
              onChange={(v) => patch({ onlinePayments: v })}
            />
            <CardControlToggle
              icon={Wifi}
              label="Contactless"
              description="Tap to pay in stores"
              checked={controls.contactless}
              onChange={(v) => patch({ contactless: v })}
            />
            <CardControlToggle
              icon={Banknote}
              label="ATM withdrawals"
              description="Cash withdrawals at ATMs"
              checked={controls.atmWithdrawals}
              onChange={(v) => patch({ atmWithdrawals: v })}
            />
            <CardControlToggle
              icon={CreditCardIcon}
              label="Magnetic stripe"
              description="Fallback swipe payments"
              checked={controls.magneticStripe}
              onChange={(v) => patch({ magneticStripe: v })}
            />
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <SpendingLimitControl
              limit={controls.spendingLimit}
              spend={controls.currentSpend}
              onChange={(v) => patch({ spendingLimit: v })}
            />
          </div>

          <CardDetailsReveal card={card} details={cardDetails} />
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface px-3.5 py-3">
      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">{label}</span>
      <span className={`truncate text-small font-medium ${accent ? "text-accent-hover" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
