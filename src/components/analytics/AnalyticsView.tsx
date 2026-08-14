"use client";

import { useState } from "react";

import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { analyticsData } from "@/data/mockBankingData";
import type { AnalyticsPeriod } from "@/types/banking";

import { CategoryBreakdown } from "./CategoryBreakdown";
import { PeriodSelector } from "./PeriodSelector";
import { SummaryStats } from "./SummaryStats";

/** The strongest visual screen in the app - a custom SVG cash-flow chart
 * (no charting library), a period switcher, and a category breakdown tied
 * to the same mock data model the Home spending preview already uses. */
export function AnalyticsView() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const data = analyticsData[period];

  return (
    <div className="flex flex-col gap-8 pb-2">
      <div className="flex flex-col gap-1">
        <span className="font-display text-h1 font-bold text-foreground">Analytics</span>
        <span className="text-small text-muted">Spending and cash flow overview</span>
      </div>

      <PeriodSelector value={period} onChange={setPeriod} />
      <SummaryStats data={data} />

      <div className="rounded-lg border border-border bg-surface p-4">
        <CashFlowChart key={period} points={data.points} />
      </div>

      <CategoryBreakdown categories={data.categories} />
    </div>
  );
}
