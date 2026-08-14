import { formatCurrency } from "@/lib/utils";
import type { AnalyticsPeriodData } from "@/types/banking";

interface SummaryStatsProps {
  data: AnalyticsPeriodData;
}

export function SummaryStats({ data }: SummaryStatsProps) {
  const stats = [
    { label: "Total Spent", value: formatCurrency(data.totalSpent) },
    { label: "Income", value: formatCurrency(data.income) },
    { label: "Net Flow", value: formatCurrency(data.netFlow, { signed: true }), accent: data.netFlow >= 0 },
    { label: "Avg Daily Spend", value: formatCurrency(data.avgDailySpend) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 rounded-lg border border-border bg-surface px-3.5 py-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">{stat.label}</span>
          <span
            className={`truncate font-mono text-small tabular font-semibold ${stat.accent ? "text-accent-hover" : "text-foreground"}`}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
