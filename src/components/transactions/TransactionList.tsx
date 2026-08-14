"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRightLeft, Car, Coffee, ShoppingBag, Tv, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Transaction, TransactionCategory } from "@/types/banking";

interface TransactionListProps {
  transactions: Transaction[];
}

const CATEGORY_ICON: Record<TransactionCategory, LucideIcon> = {
  Food: Coffee,
  Shopping: ShoppingBag,
  Transport: Car,
  Entertainment: Tv,
  Income: Wallet,
  Transfer: ArrowRightLeft,
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function TransactionList({ transactions }: TransactionListProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-caption uppercase tracking-widest text-muted">Recent Transactions</span>
      </div>

      <motion.ul
        initial="hidden"
        animate="show"
        variants={prefersReducedMotion ? undefined : listVariants}
        className="flex flex-col"
      >
        {transactions.map((tx) => {
          const Icon = CATEGORY_ICON[tx.category];
          const positive = tx.amount > 0;
          return (
            <motion.li
              key={tx.id}
              variants={prefersReducedMotion ? undefined : rowVariants}
              className="flex items-center gap-3 border-b border-border py-3.5 last:border-b-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-foreground/80">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-small font-medium text-foreground">{tx.label}</span>
                <span className="font-mono text-caption text-muted">{tx.date}</span>
              </div>
              <span className={`font-mono text-small tabular ${positive ? "text-accent-hover" : "text-foreground"}`}>
                {formatCurrency(tx.amount, { signed: true })}
              </span>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
