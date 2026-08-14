"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

import { PaymentCard } from "@/components/card/PaymentCard";
import { SpendingChart } from "@/components/charts/SpendingChart";
import { SIDEBAR_ITEMS, Sidebar } from "@/components/navigation/Sidebar";
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

import { AccountPanel } from "./AccountPanel";
import { BalanceSummary } from "./BalanceSummary";
import { DashboardHeader } from "./DashboardHeader";
import { QuickActions } from "./QuickActions";
import { SavingsTeaser } from "./SavingsTeaser";

// Code-split off the critical intro -> login -> overview path, which
// every session hits, so a session that never opens Cards/Analytics/
// Savings never pays to parse/execute them.
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
  settings: "Settings",
};

/**
 * A basic three-region desktop shell - sidebar, central content, a right
 * card/actions column. "Overview", "Cards", "Analytics" and "Savings" are
 * now real destinations; Payments/Settings still hand off to an honest
 * placeholder (no fake Settings content). The right-rail card+actions
 * column is Overview-only - it would otherwise mount a second independent
 * PaymentCard instance (its own pointer listeners) alongside whichever
 * full page is showing, which is both visually redundant and unnecessary
 * interactive surface.
 */
export function DesktopShell() {
  const [activeTab, setActiveTab] = useState("overview");
  const [frozen, setFrozen] = useState(false);
  const [balance, setBalance] = useState(account.balance);
  const [txns, setTxns] = useState<Transaction[]>(transactions);
  const [sendOpen, setSendOpen] = useState(false);
  const [cardControls, setCardControls] = useState<CardControls>(defaultCardControls);
  const [goals, setGoals] = useState<SavingsGoal[]>(savingsGoalsSeed);

  // "Adjusting state when a value changes," computed during render rather
  // than an effect (see react.dev/learn/you-might-not-need-an-effect) -
  // the moment activeTab changes AWAY FROM "overview", Overview's content
  // (and BalanceSummary with it) is about to unmount, so this is the one
  // safe point to remember its entrance already played once. The *next*
  // time "overview" mounts, BalanceSummary skips the count-up instead of
  // flashing back to €0.00.
  const [prevTab, setPrevTab] = useState(activeTab);
  const [hasRevealedBalance, setHasRevealedBalance] = useState(false);
  if (activeTab !== prevTab) {
    setPrevTab(activeTab);
    if (prevTab === "overview") setHasRevealedBalance(true);
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
  if (activeTab === "overview") {
    content = (
      <div className="flex max-w-2xl flex-col gap-8">
        <DashboardHeader name={account.holderName} />
        <BalanceSummary balance={balance} status={account.status} skipEntranceAnimation={hasRevealedBalance} />
        <SavingsTeaser goals={goals} onOpen={() => setActiveTab("savings")} />
        <SpendingChart categories={spending} total={spendingTotal} />
        <TransactionList transactions={txns} />
      </div>
    );
  } else if (activeTab === "cards") {
    content = (
      <div className="max-w-4xl">
        <CardsView
          card={card}
          cardDetails={cardDetails}
          balance={balance}
          frozen={frozen}
          onToggleFreeze={() => setFrozen((f) => !f)}
          controls={cardControls}
          onControlsChange={setCardControls}
        />
      </div>
    );
  } else if (activeTab === "analytics") {
    content = (
      <div className="max-w-4xl">
        <AnalyticsView />
      </div>
    );
  } else if (activeTab === "savings") {
    content = (
      <div className="max-w-4xl">
        <SavingsView goals={goals} onGoalsChange={setGoals} />
      </div>
    );
  } else {
    const item = SIDEBAR_ITEMS.find((navItem) => navItem.id === activeTab);
    content = (
      <PlaceholderView icon={item?.icon ?? SIDEBAR_ITEMS[0].icon} label={PLACEHOLDER_LABELS[activeTab] ?? activeTab} />
    );
  }

  return (
    <div className="flex h-dvh w-full">
      <Sidebar activeId={activeTab} onSelect={setActiveTab} />

      <div className="flex min-w-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto px-10 py-8">{content}</main>

        {activeTab === "overview" && (
          <aside className="hidden w-80 shrink-0 flex-col gap-8 border-l border-border px-6 py-8 xl:flex">
            <PaymentCard card={card} frozen={frozen} />
            <QuickActions frozen={frozen} onToggleFreeze={() => setFrozen((f) => !f)} onSend={() => setSendOpen(true)} />
            <AccountPanel account={account} />
            <ConceptBadge className="mt-auto" />
          </aside>
        )}
      </div>

      <AnimatePresence>
        {sendOpen && (
          <SendMoneyFlow
            presentation="modal"
            balance={balance}
            onClose={() => setSendOpen(false)}
            onComplete={handleTransferComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
