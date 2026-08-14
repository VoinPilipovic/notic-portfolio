"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

import { PaymentCard } from "@/components/card/PaymentCard";
import { SpendingChart } from "@/components/charts/SpendingChart";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MOBILE_NAV_ITEMS } from "@/components/navigation/navItems";
import { ConceptBadge } from "@/components/shared/ConceptBadge";
import { PlaceholderView } from "@/components/shared/PlaceholderView";
import { ViewLoadingFallback } from "@/components/shared/ViewLoadingFallback";
import { SendMoneyFlow } from "@/components/transfer/SendMoneyFlow";
import { TransactionList } from "@/components/transactions/TransactionList";
import {
  account,
  card,
  cardDetails,
  defaultCardControls,
  savingsGoals as savingsGoalsSeed,
  spending,
  spendingTotal,
  transactions,
} from "@/data/mockBankingData";
import type { CardControls, Recipient, SavingsGoal, Transaction } from "@/types/banking";

import { BalanceSummary } from "./BalanceSummary";
import { DashboardHeader } from "./DashboardHeader";
import { QuickActions } from "./QuickActions";
import { SavingsTeaser } from "./SavingsTeaser";

// Code-split off the critical intro -> login -> home path, which every
// session hits, so a session that never opens Cards/Analytics/Savings
// never pays to parse/execute them.
const CardsView = dynamic(() => import("@/components/cards/CardsView").then((m) => m.CardsView), {
  loading: () => <ViewLoadingFallback />,
});
const AnalyticsView = dynamic(() => import("@/components/analytics/AnalyticsView").then((m) => m.AnalyticsView), {
  loading: () => <ViewLoadingFallback />,
});
const SavingsView = dynamic(() => import("@/components/savings/SavingsView").then((m) => m.SavingsView), {
  loading: () => <ViewLoadingFallback />,
});

const PLACEHOLDER_LABELS: Record<string, string> = {
  payments: "Payments",
  profile: "Profile",
};

/** The mobile-first dashboard shell - "Home", "Cards", "Analytics" and
 * "Savings" are real; Payments/Profile still hand off to an honest
 * placeholder. Balance, transactions, card controls and savings goals are
 * all local session state (no backend, refresh resets it), lifted here so
 * they survive switching between tabs. */
export function MobileDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [frozen, setFrozen] = useState(false);
  const [balance, setBalance] = useState(account.balance);
  const [txns, setTxns] = useState<Transaction[]>(transactions);
  const [sendOpen, setSendOpen] = useState(false);
  const [cardControls, setCardControls] = useState<CardControls>(defaultCardControls);
  const [goals, setGoals] = useState<SavingsGoal[]>(savingsGoalsSeed);

  // "Adjusting state when a value changes," computed during render rather
  // than an effect (see react.dev/learn/you-might-not-need-an-effect) -
  // the moment activeTab changes AWAY FROM "home", Home's content (and
  // BalanceSummary with it) is about to unmount, so this is the one safe
  // point to remember that its entrance has already played once. The
  // *next* time "home" mounts, BalanceSummary skips the count-up instead
  // of flashing back to €0.00.
  const [prevTab, setPrevTab] = useState(activeTab);
  const [hasRevealedBalance, setHasRevealedBalance] = useState(false);
  if (activeTab !== prevTab) {
    setPrevTab(activeTab);
    if (prevTab === "home") setHasRevealedBalance(true);
  }

  const handleTransferComplete = (recipient: Recipient, amount: number, note: string) => {
    setBalance((prev) => prev - amount);
    setTxns((prev) => [
      { id: `t-${Date.now()}`, label: `Transfer — ${recipient.name}`, category: "Transfer", amount: -amount, date: "Just now" },
      ...prev,
    ]);
    void note;
  };

  let content: ReactNode;
  if (activeTab === "home") {
    content = (
      <div className="flex flex-col gap-8">
        <DashboardHeader name={account.holderName} />
        <BalanceSummary balance={balance} status={account.status} skipEntranceAnimation={hasRevealedBalance} />
        <PaymentCard card={card} frozen={frozen} />
        <QuickActions frozen={frozen} onToggleFreeze={() => setFrozen((f) => !f)} onSend={() => setSendOpen(true)} />
        <SavingsTeaser goals={goals} onOpen={() => setActiveTab("savings")} />
        <SpendingChart categories={spending} total={spendingTotal} />
        <TransactionList transactions={txns} />
        <ConceptBadge className="pb-2 text-center" />
      </div>
    );
  } else if (activeTab === "cards") {
    content = (
      <CardsView
        card={card}
        cardDetails={cardDetails}
        balance={balance}
        frozen={frozen}
        onToggleFreeze={() => setFrozen((f) => !f)}
        controls={cardControls}
        onControlsChange={setCardControls}
      />
    );
  } else if (activeTab === "analytics") {
    content = <AnalyticsView />;
  } else if (activeTab === "savings") {
    content = <SavingsView goals={goals} onGoalsChange={setGoals} />;
  } else {
    const item = MOBILE_NAV_ITEMS.find((navItem) => navItem.id === activeTab);
    content = <PlaceholderView icon={item?.icon ?? MOBILE_NAV_ITEMS[0].icon} label={PLACEHOLDER_LABELS[activeTab] ?? "Coming soon"} />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex flex-1 flex-col px-gutter pb-28 pt-6">{content}</div>

      <BottomNav activeId={activeTab} onSelect={setActiveTab} />

      <AnimatePresence>
        {sendOpen && (
          <SendMoneyFlow
            presentation="sheet"
            balance={balance}
            onClose={() => setSendOpen(false)}
            onComplete={handleTransferComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
